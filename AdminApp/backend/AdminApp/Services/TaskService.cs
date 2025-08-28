using AdminApp.Data.Repositories.Interfaces;
using AdminApp.Models;
using AdminApp.Services.Interfaces;

namespace AdminApp.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repo;
        public TaskService(ITaskRepository repo) => _repo = repo;

        public async Task<IEnumerable<TaskItem>> GetTasks(string? search, int page, int limit)
            => await _repo.GetTasks(search, page, limit);

        public async Task<TaskItem> AddTask(TaskItem task)
        {
            var id = await _repo.AddTask(task);
            task.Id = id;
            return task;
        }

        public async Task UpdateTask(TaskItem task) => await _repo.UpdateTask(task);

        public async Task DeleteTask(int id) => await _repo.DeleteTask(id);
    }

}
