using AdminApp.Data.Repositories.Interfaces;
using AdminApp.Models;
using Dapper;

namespace AdminApp.Data.Repositories
{

    public class TaskRepository: ITaskRepository
    {
        private readonly DbContext _db;
        public TaskRepository(DbContext db) => _db = db;

        public async Task<IEnumerable<TaskItem>> GetTasks(string? search, int page, int limit)
        {
            using var conn = _db.CreateConnection();
            var offset = (page - 1) * limit;

            var sql = @"
            SELECT * FROM Tasks
            WHERE (@search IS NULL OR Title LIKE '%' + @search + '%')
            ORDER BY Id
            OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;

            SELECT COUNT(*) FROM Tasks
            WHERE (@search IS NULL OR Title LIKE '%' + @search + '%');
        ";

            using var multi = await conn.QueryMultipleAsync(sql, new { search, offset, limit });
            var tasks = await multi.ReadAsync<TaskItem>();
            var total = await multi.ReadSingleAsync<int>();

            return tasks;
        }

        public async Task<int> AddTask(TaskItem task)
        {
            using var conn = _db.CreateConnection();
            var sql = "INSERT INTO Tasks (Title, Difficulty) VALUES (@Title, @Difficulty); SELECT SCOPE_IDENTITY();";
            return await conn.ExecuteScalarAsync<int>(sql, task);
        }

        public async Task UpdateTask(TaskItem task)
        {
            using var conn = _db.CreateConnection();
            await conn.ExecuteAsync("UPDATE Tasks SET Title=@Title, Difficulty=@Difficulty WHERE Id=@Id", task);
        }

        public async Task DeleteTask(int id)
        {
            using var conn = _db.CreateConnection();
            await conn.ExecuteAsync("DELETE FROM Tasks WHERE Id=@id", new { id });
        }
    }

}
