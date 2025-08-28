using AdminApp.DTOs.Auth;
using AdminApp.Helpers;
using AdminApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Shpargalkin.AdminApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet("csrf")]
    [AllowAnonymous]
    public IActionResult GetCsrfToken()
    {
        var csrfCookieName = Environment.GetEnvironmentVariable("CSRF_COOKIE_NAME") ?? "csrf_token";
        var csrfToken = Guid.NewGuid().ToString("N");

        var isProd = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production";

        Response.Cookies.Append(csrfCookieName, csrfToken, new CookieOptions
        {
            HttpOnly = false,                    // фронт может читать
            Secure = isProd,                     // true в prod, false для localhost
            SameSite = isProd ? SameSiteMode.Strict : SameSiteMode.None,
            Path = "/",
            Domain = isProd ? null : "localhost" // важно для локалки
        });

        return Ok(new { token = csrfToken });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, [FromServices] IAuthService authService)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { message = "Email и пароль обязательны" });

        var csrfCookieName = Environment.GetEnvironmentVariable("CSRF_COOKIE_NAME") ?? "csrf_token";
        var csrfHeader = Request.Headers["x-csrf-token"].FirstOrDefault();
        var csrfCookie = Request.Cookies[csrfCookieName];

        if (csrfHeader == null || csrfCookie == null || csrfHeader != csrfCookie)
            return StatusCode(403, new { message = "CSRF проверка не пройдена" });

        var user = await _authService.ValidateUserAsync(request.Email, request.Password);
        if (user == null)
            return Unauthorized(new { message = "Неверные учетные данные" });

        var tokens = await _authService.GenerateTokens(user);

        // Сохраняем JWT в cookies
        Response.Cookies.Append("access_token", tokens.AccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production",
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        Response.Cookies.Append("refresh_token", tokens.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production",
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        // 🔄 Ротация CSRF — удаляем старый токен и ставим новый
        var newCsrf = Guid.NewGuid().ToString("N");
        Response.Cookies.Append(csrfCookieName, newCsrf, new CookieOptions
        {
            HttpOnly = false,
            Secure = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production",
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        return Ok(new { ok = true, csrfToken = newCsrf });
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
    {
        var result = await _authService.RefreshToken(request.RefreshToken);

        if (result == null)
            return Unauthorized(new { message = "Refresh токен недействителен" });

        return Ok(result);
    }

    /// <summary>
    /// Текущий пользователь (по access-токену)
    /// </summary>
    [HttpGet("me")]
    //[Authorize] // проверяем JWT
    public async Task<IActionResult> Me()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized(new { message = "Нет идентификатора пользователя" });

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Некорректный идентификатор" });

        var user = await _authService.CheckMeAsync(userId);
        if (user == null)
            return Unauthorized(new { message = "Пользователь не найден" });

        return Ok(new User
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role ?? "user"
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] RefreshRequest request)
    {
        await _authService.Logout(request.RefreshToken);
        return Ok(new { message = "Выход выполнен" });
    }
}
