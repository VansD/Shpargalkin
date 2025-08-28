// Data/DbContext.cs
using Microsoft.Data.SqlClient;
using System.Data;

namespace AdminApp.Data;

public class DbContext
{
    private readonly IConfiguration _config;
    public DbContext(IConfiguration config) => _config = config;

    public IDbConnection CreateConnection()
        => new SqlConnection(_config.GetConnectionString("DefaultConnection"));
}
