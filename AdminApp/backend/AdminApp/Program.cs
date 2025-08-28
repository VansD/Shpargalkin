using AdminApp.Data;
using AdminApp.Data.Repositories;
using AdminApp.Data.Repositories.Interfaces;
using AdminApp.Services;
using AdminApp.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddSingleton<DbContext>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITaskService, TaskService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// CORS для фронтенда админки
builder.Services.AddCors(options =>
{
    options.AddPolicy("AdminFrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // адрес фронта
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials(); // чтобы работали куки
    });
});

// JWT
var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false; // включить true в проде за HTTPS
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();
app.UseHttpsRedirection();

app.UseCors("AdminFrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();