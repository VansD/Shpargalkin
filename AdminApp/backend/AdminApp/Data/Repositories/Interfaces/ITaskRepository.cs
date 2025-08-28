using AdminApp.Models;

namespace AdminApp.Data.Repositories.Interfaces
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskItem>> GetTasks(string? search, int page, int limit);
        Task<int> AddTask(TaskItem task);
        Task UpdateTask(TaskItem task);
        Task DeleteTask(int id);
    }
}
