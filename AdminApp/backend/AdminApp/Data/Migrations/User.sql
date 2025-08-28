-- Users
CREATE TABLE [dbo].[Users](
  [Id] INT IDENTITY(1,1) PRIMARY KEY,
  [Email] NVARCHAR(256) NOT NULL UNIQUE,
  [PasswordHash] NVARCHAR(200) NOT NULL,
  [Role] NVARCHAR(50) NOT NULL DEFAULT 'admin',
  [CreatedAt] DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Refresh tokens (привязаны к юзеру и устройству/сессии)
CREATE TABLE UserRefreshTokens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    RefreshToken NVARCHAR(500) NOT NULL,
    ExpiryDate DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

INSERT INTO [dbo].[Users] (Email, PasswordHash, Role)
VALUES ('vans_d@mail.ru', '$2b$12$GGZccFfy6yMc70mhhbJDzentFW3.b/QyIGyl7P9UdeAZAt5YCQW6y', 'admin');

