IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [Matricula] nvarchar(10) NOT NULL,
    [Nombre] nvarchar(50) NOT NULL,
    [ApellidoPaterno] nvarchar(50) NOT NULL,
    [ApellidoMaterno] nvarchar(50) NOT NULL,
    [Role] nvarchar(20) NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241216100902_Mig00', N'9.0.0');

CREATE TABLE [Semesters] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Year] int NOT NULL,
    [Period] nvarchar(1) NOT NULL,
    [Description] nvarchar(200) NOT NULL,
    [ProfessorId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_Semesters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Semesters_AspNetUsers_ProfessorId] FOREIGN KEY ([ProfessorId]) REFERENCES [AspNetUsers] ([Id])
);

CREATE TABLE [SemesterStudents] (
    [SemesterId] int NOT NULL,
    [StudentId] nvarchar(450) NOT NULL,
    [ApplicationUserId] nvarchar(450) NULL,
    CONSTRAINT [PK_SemesterStudents] PRIMARY KEY ([SemesterId], [StudentId]),
    CONSTRAINT [FK_SemesterStudents_AspNetUsers_ApplicationUserId] FOREIGN KEY ([ApplicationUserId]) REFERENCES [AspNetUsers] ([Id]),
    CONSTRAINT [FK_SemesterStudents_AspNetUsers_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [AspNetUsers] ([Id]),
    CONSTRAINT [FK_SemesterStudents_Semesters_SemesterId] FOREIGN KEY ([SemesterId]) REFERENCES [Semesters] ([Id])
);

CREATE INDEX [IX_Semesters_ProfessorId] ON [Semesters] ([ProfessorId]);

CREATE INDEX [IX_SemesterStudents_ApplicationUserId] ON [SemesterStudents] ([ApplicationUserId]);

CREATE INDEX [IX_SemesterStudents_StudentId] ON [SemesterStudents] ([StudentId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241219074641_MigSemestre01', N'9.0.0');

ALTER TABLE [Semesters] ADD [Course] nvarchar(50) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241219082715_MigSemestre02', N'9.0.0');

CREATE TABLE [Projects] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [CreatedById] nvarchar(450) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [CurrentPhase] int NOT NULL,
    [SemesterId] int NULL,
    CONSTRAINT [PK_Projects] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Projects_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]),
    CONSTRAINT [FK_Projects_Semesters_SemesterId] FOREIGN KEY ([SemesterId]) REFERENCES [Semesters] ([Id])
);

CREATE INDEX [IX_Projects_CreatedById] ON [Projects] ([CreatedById]);

CREATE INDEX [IX_Projects_SemesterId] ON [Projects] ([SemesterId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241223014328_Mig03', N'9.0.0');

ALTER TABLE [Projects] ADD [CorporateColors] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [CorporateFont] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [FunctionalRequirements] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [GeneralObjective] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [SpecificObjectives] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [StartDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241229031349_Mig04Project', N'9.0.0');

CREATE TABLE [Phases] (
    [Id] int NOT NULL IDENTITY,
    [ProjectId] int NOT NULL,
    [PhaseNumber] int NOT NULL,
    [Data] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Phases] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Phases_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Phases_ProjectId] ON [Phases] ([ProjectId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241230012207_Mig05Phase', N'9.0.0');

ALTER TABLE [Projects] ADD [ClienteName] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [ReflectiveAnswers] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241230031914_Mig06Project', N'9.0.0');

EXEC sp_rename N'[Projects].[SpecificObjectives]', N'SpecificObjectivesJson', 'COLUMN';

EXEC sp_rename N'[Projects].[FunctionalRequirements]', N'FunctionalRequirementsJson', 'COLUMN';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250104005721_Mig07SO', N'9.0.0');

ALTER TABLE [Projects] ADD [AllowedTechnologies] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [CustomTechnologies] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250104030540_Mig08', N'9.0.0');

ALTER TABLE [Projects] ADD [CustomRequirementsJson] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250105034036_Mig09', N'9.0.0');

ALTER TABLE [SemesterStudents] DROP CONSTRAINT [FK_SemesterStudents_Semesters_SemesterId];

ALTER TABLE [SemesterStudents] ADD CONSTRAINT [FK_SemesterStudents_Semesters_SemesterId] FOREIGN KEY ([SemesterId]) REFERENCES [Semesters] ([Id]) ON DELETE CASCADE;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250107181308_Mig10', N'9.0.0');

ALTER TABLE [Projects] DROP CONSTRAINT [FK_Projects_Semesters_SemesterId];

ALTER TABLE [Projects] ADD CONSTRAINT [FK_Projects_Semesters_SemesterId] FOREIGN KEY ([SemesterId]) REFERENCES [Semesters] ([Id]) ON DELETE CASCADE;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250107193345_Mig11', N'9.0.0');

ALTER TABLE [Projects] DROP CONSTRAINT [FK_Projects_AspNetUsers_CreatedById];

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'CreatedById');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Projects] ALTER COLUMN [CreatedById] nvarchar(450) NULL;

ALTER TABLE [Projects] ADD CONSTRAINT [FK_Projects_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250107203449_Mig12', N'9.0.0');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250111055413_Mig13', N'9.0.0');

CREATE TABLE [DesignPhases] (
    [Id] int NOT NULL IDENTITY,
    [ProjectId] int NOT NULL,
    [SiteMapFilePath] nvarchar(max) NOT NULL,
    [IsHierarchyClear] bit NOT NULL,
    [AreSectionsIdentified] bit NOT NULL,
    [AreLinksClear] bit NOT NULL,
    [AreVisualElementsUseful] bit NOT NULL,
    [Wireframe480pxPath] nvarchar(max) NOT NULL,
    [Wireframe768pxPath] nvarchar(max) NOT NULL,
    [Wireframe1024pxPath] nvarchar(max) NOT NULL,
    [IsMobileFirst] bit NOT NULL,
    [IsNavigationClear] bit NOT NULL,
    [IsDesignFunctional] bit NOT NULL,
    [IsVisualConsistencyMet] bit NOT NULL,
    [VisualDesignFilePath] nvarchar(max) NOT NULL,
    [AreVisualElementsBeneficialForSmallScreens] bit NOT NULL,
    [DoesDesignPrioritizeContentForMobile] bit NOT NULL,
    [DoesDesignImproveLoadingSpeed] bit NOT NULL,
    [ContentFilePath] nvarchar(max) NOT NULL,
    [AreContentsRelevantForMobile] bit NOT NULL,
    [AreContentsClearAndNavigable] bit NOT NULL,
    [DoContentsGuideUserAttention] bit NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_DesignPhases] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DesignPhases_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_DesignPhases_ProjectId] ON [DesignPhases] ([ProjectId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250111060227_Mig14', N'9.0.0');

ALTER TABLE [Phases] ADD [UpdatedAt] datetime2 NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250204185445_Mig15', N'9.0.0');

ALTER TABLE [Projects] ADD [BenchmarkConsideredMobileFirst] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [Projects] ADD [BenchmarkFindings] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [BenchmarkImprovements] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [BenchmarkObjective] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [BenchmarkResponsable] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [BenchmarkSector] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [BenchmarkUsedSmartphoneForComparative] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [Projects] ADD [BenchmarkUsedSmartphoneForScreens] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [Projects] ADD [Competitor1Difficulties] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor1EaseOfUse] int NOT NULL DEFAULT 0;

ALTER TABLE [Projects] ADD [Competitor1Name] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor1Negatives] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor1Positives] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor1ScreenshotPath] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor1Url] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor1UsefulFeatures] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor2Difficulties] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor2EaseOfUse] int NOT NULL DEFAULT 0;

ALTER TABLE [Projects] ADD [Competitor2Name] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor2Negatives] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor2Positives] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor2ScreenshotPath] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor2Url] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Projects] ADD [Competitor2UsefulFeatures] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250307002650_Mig16Bench', N'9.0.0');

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'AllowedTechnologies');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [Projects] DROP COLUMN [AllowedTechnologies];

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'BenchmarkConsideredMobileFirst');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [Projects] DROP COLUMN [BenchmarkConsideredMobileFirst];

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'BenchmarkFindings');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [Projects] DROP COLUMN [BenchmarkFindings];

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'BenchmarkImprovements');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [Projects] DROP COLUMN [BenchmarkImprovements];

DECLARE @var5 sysname;
SELECT @var5 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'BenchmarkObjective');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var5 + '];');
ALTER TABLE [Projects] DROP COLUMN [BenchmarkObjective];

DECLARE @var6 sysname;
SELECT @var6 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'BenchmarkResponsable');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var6 + '];');
ALTER TABLE [Projects] DROP COLUMN [BenchmarkResponsable];

DECLARE @var7 sysname;
SELECT @var7 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'BenchmarkSector');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var7 + '];');
ALTER TABLE [Projects] DROP COLUMN [BenchmarkSector];

DECLARE @var8 sysname;
SELECT @var8 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'BenchmarkUsedSmartphoneForComparative');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var8 + '];');
ALTER TABLE [Projects] DROP COLUMN [BenchmarkUsedSmartphoneForComparative];

DECLARE @var9 sysname;
SELECT @var9 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'BenchmarkUsedSmartphoneForScreens');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var9 + '];');
ALTER TABLE [Projects] DROP COLUMN [BenchmarkUsedSmartphoneForScreens];

DECLARE @var10 sysname;
SELECT @var10 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'ClienteName');
IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var10 + '];');
ALTER TABLE [Projects] DROP COLUMN [ClienteName];

DECLARE @var11 sysname;
SELECT @var11 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor1Difficulties');
IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var11 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor1Difficulties];

DECLARE @var12 sysname;
SELECT @var12 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor1EaseOfUse');
IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var12 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor1EaseOfUse];

DECLARE @var13 sysname;
SELECT @var13 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor1Name');
IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var13 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor1Name];

DECLARE @var14 sysname;
SELECT @var14 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor1Negatives');
IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var14 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor1Negatives];

DECLARE @var15 sysname;
SELECT @var15 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor1Positives');
IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var15 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor1Positives];

DECLARE @var16 sysname;
SELECT @var16 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor1ScreenshotPath');
IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var16 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor1ScreenshotPath];

DECLARE @var17 sysname;
SELECT @var17 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor1Url');
IF @var17 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var17 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor1Url];

DECLARE @var18 sysname;
SELECT @var18 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor1UsefulFeatures');
IF @var18 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var18 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor1UsefulFeatures];

DECLARE @var19 sysname;
SELECT @var19 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor2Difficulties');
IF @var19 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var19 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor2Difficulties];

DECLARE @var20 sysname;
SELECT @var20 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor2EaseOfUse');
IF @var20 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var20 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor2EaseOfUse];

DECLARE @var21 sysname;
SELECT @var21 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor2Name');
IF @var21 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var21 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor2Name];

DECLARE @var22 sysname;
SELECT @var22 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor2Negatives');
IF @var22 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var22 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor2Negatives];

DECLARE @var23 sysname;
SELECT @var23 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor2Positives');
IF @var23 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var23 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor2Positives];

DECLARE @var24 sysname;
SELECT @var24 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor2ScreenshotPath');
IF @var24 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var24 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor2ScreenshotPath];

DECLARE @var25 sysname;
SELECT @var25 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor2Url');
IF @var25 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var25 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor2Url];

DECLARE @var26 sysname;
SELECT @var26 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'Competitor2UsefulFeatures');
IF @var26 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var26 + '];');
ALTER TABLE [Projects] DROP COLUMN [Competitor2UsefulFeatures];

DECLARE @var27 sysname;
SELECT @var27 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'CorporateColors');
IF @var27 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var27 + '];');
ALTER TABLE [Projects] DROP COLUMN [CorporateColors];

DECLARE @var28 sysname;
SELECT @var28 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'CorporateFont');
IF @var28 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var28 + '];');
ALTER TABLE [Projects] DROP COLUMN [CorporateFont];

DECLARE @var29 sysname;
SELECT @var29 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'CustomRequirementsJson');
IF @var29 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var29 + '];');
ALTER TABLE [Projects] DROP COLUMN [CustomRequirementsJson];

DECLARE @var30 sysname;
SELECT @var30 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'CustomTechnologies');
IF @var30 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var30 + '];');
ALTER TABLE [Projects] DROP COLUMN [CustomTechnologies];

DECLARE @var31 sysname;
SELECT @var31 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'FunctionalRequirementsJson');
IF @var31 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var31 + '];');
ALTER TABLE [Projects] DROP COLUMN [FunctionalRequirementsJson];

DECLARE @var32 sysname;
SELECT @var32 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'GeneralObjective');
IF @var32 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var32 + '];');
ALTER TABLE [Projects] DROP COLUMN [GeneralObjective];

DECLARE @var33 sysname;
SELECT @var33 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'ReflectiveAnswers');
IF @var33 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var33 + '];');
ALTER TABLE [Projects] DROP COLUMN [ReflectiveAnswers];

DECLARE @var34 sysname;
SELECT @var34 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Projects]') AND [c].[name] = N'SpecificObjectivesJson');
IF @var34 IS NOT NULL EXEC(N'ALTER TABLE [Projects] DROP CONSTRAINT [' + @var34 + '];');
ALTER TABLE [Projects] DROP COLUMN [SpecificObjectivesJson];

CREATE TABLE [PlanningPhases] (
    [Id] int NOT NULL IDENTITY,
    [ProjectId] int NOT NULL,
    [ProjectName] nvarchar(100) NOT NULL,
    [ClienteName] nvarchar(100) NOT NULL,
    [Responsable] nvarchar(100) NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [GeneralObjective] nvarchar(max) NOT NULL,
    [SpecificObjectives] nvarchar(max) NOT NULL,
    [FunctionalRequirements] nvarchar(max) NOT NULL,
    [CustomRequirements] nvarchar(max) NOT NULL,
    [CorporateColors] nvarchar(max) NOT NULL,
    [CorporateFont] nvarchar(max) NOT NULL,
    [AllowedTechnologies] nvarchar(max) NOT NULL,
    [CustomTechnologies] nvarchar(max) NOT NULL,
    [ReflectionPhase1] nvarchar(max) NOT NULL,
    [BenchmarkObjective] nvarchar(max) NOT NULL,
    [BenchmarkSector] nvarchar(max) NOT NULL,
    [BenchmarkResponsableF2] nvarchar(max) NOT NULL,
    [Competitor1Name] nvarchar(max) NOT NULL,
    [Competitor1ScreenshotPath] nvarchar(max) NOT NULL,
    [Competitor1Url] nvarchar(max) NOT NULL,
    [Competitor1Positives] nvarchar(max) NOT NULL,
    [Competitor1Negatives] nvarchar(max) NOT NULL,
    [Competitor1EaseOfUse] int NOT NULL,
    [Competitor1Difficulties] nvarchar(max) NOT NULL,
    [Competitor1UsefulFeatures] nvarchar(max) NOT NULL,
    [Competitor2Name] nvarchar(max) NOT NULL,
    [Competitor2ScreenshotPath] nvarchar(max) NOT NULL,
    [Competitor2Url] nvarchar(max) NOT NULL,
    [Competitor2Positives] nvarchar(max) NOT NULL,
    [Competitor2Negatives] nvarchar(max) NOT NULL,
    [Competitor2EaseOfUse] int NOT NULL,
    [Competitor2Difficulties] nvarchar(max) NOT NULL,
    [Competitor2UsefulFeatures] nvarchar(max) NOT NULL,
    [BenchmarkFindings] nvarchar(max) NOT NULL,
    [BenchmarkImprovements] nvarchar(max) NOT NULL,
    [BenchmarkUsedSmartphoneForScreens] bit NOT NULL,
    [BenchmarkUsedSmartphoneForComparative] bit NOT NULL,
    [BenchmarkConsideredMobileFirst] bit NOT NULL,
    [ReflectionPhase2] nvarchar(max) NOT NULL,
    [AudienceQuestions] nvarchar(max) NOT NULL,
    [ReflectionPhase3] nvarchar(max) NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_PlanningPhases] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PlanningPhases_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
);

CREATE UNIQUE INDEX [IX_PlanningPhases_ProjectId] ON [PlanningPhases] ([ProjectId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250308030747_Mig17Separacion', N'9.0.0');

DECLARE @var35 sysname;
SELECT @var35 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DesignPhases]') AND [c].[name] = N'Wireframe768pxPath');
IF @var35 IS NOT NULL EXEC(N'ALTER TABLE [DesignPhases] DROP CONSTRAINT [' + @var35 + '];');
ALTER TABLE [DesignPhases] ALTER COLUMN [Wireframe768pxPath] nvarchar(max) NULL;

DECLARE @var36 sysname;
SELECT @var36 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DesignPhases]') AND [c].[name] = N'Wireframe480pxPath');
IF @var36 IS NOT NULL EXEC(N'ALTER TABLE [DesignPhases] DROP CONSTRAINT [' + @var36 + '];');
ALTER TABLE [DesignPhases] ALTER COLUMN [Wireframe480pxPath] nvarchar(max) NULL;

DECLARE @var37 sysname;
SELECT @var37 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DesignPhases]') AND [c].[name] = N'Wireframe1024pxPath');
IF @var37 IS NOT NULL EXEC(N'ALTER TABLE [DesignPhases] DROP CONSTRAINT [' + @var37 + '];');
ALTER TABLE [DesignPhases] ALTER COLUMN [Wireframe1024pxPath] nvarchar(max) NULL;

DECLARE @var38 sysname;
SELECT @var38 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DesignPhases]') AND [c].[name] = N'VisualDesignFilePath');
IF @var38 IS NOT NULL EXEC(N'ALTER TABLE [DesignPhases] DROP CONSTRAINT [' + @var38 + '];');
ALTER TABLE [DesignPhases] ALTER COLUMN [VisualDesignFilePath] nvarchar(max) NULL;

DECLARE @var39 sysname;
SELECT @var39 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DesignPhases]') AND [c].[name] = N'SiteMapFilePath');
IF @var39 IS NOT NULL EXEC(N'ALTER TABLE [DesignPhases] DROP CONSTRAINT [' + @var39 + '];');
ALTER TABLE [DesignPhases] ALTER COLUMN [SiteMapFilePath] nvarchar(max) NULL;

DECLARE @var40 sysname;
SELECT @var40 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DesignPhases]') AND [c].[name] = N'ContentFilePath');
IF @var40 IS NOT NULL EXEC(N'ALTER TABLE [DesignPhases] DROP CONSTRAINT [' + @var40 + '];');
ALTER TABLE [DesignPhases] ALTER COLUMN [ContentFilePath] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250310025525_Mig18Design', N'9.0.0');

CREATE TABLE [DevelopmentPhases] (
    [Id] int NOT NULL IDENTITY,
    [ProjectId] int NOT NULL,
    [Summary] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Milestones] nvarchar(max) NOT NULL,
    [CurrentVersion] nvarchar(max) NOT NULL,
    [RepositoryUrl] nvarchar(max) NOT NULL,
    [UnitTestsPassed] bit NOT NULL,
    [IssuesFound] nvarchar(max) NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_DevelopmentPhases] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DevelopmentPhases_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
);

CREATE UNIQUE INDEX [IX_DevelopmentPhases_ProjectId] ON [DevelopmentPhases] ([ProjectId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250310165944_Mig19Development', N'9.0.0');

ALTER TABLE [DevelopmentPhases] ADD [CreatedAt] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250310170139_Mig20CrearDevelopment', N'9.0.0');

DECLARE @var41 sysname;
SELECT @var41 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DevelopmentPhases]') AND [c].[name] = N'CurrentVersion');
IF @var41 IS NOT NULL EXEC(N'ALTER TABLE [DevelopmentPhases] DROP CONSTRAINT [' + @var41 + '];');
ALTER TABLE [DevelopmentPhases] DROP COLUMN [CurrentVersion];

DECLARE @var42 sysname;
SELECT @var42 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DevelopmentPhases]') AND [c].[name] = N'Description');
IF @var42 IS NOT NULL EXEC(N'ALTER TABLE [DevelopmentPhases] DROP CONSTRAINT [' + @var42 + '];');
ALTER TABLE [DevelopmentPhases] DROP COLUMN [Description];

DECLARE @var43 sysname;
SELECT @var43 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[DevelopmentPhases]') AND [c].[name] = N'UnitTestsPassed');
IF @var43 IS NOT NULL EXEC(N'ALTER TABLE [DevelopmentPhases] DROP CONSTRAINT [' + @var43 + '];');
ALTER TABLE [DevelopmentPhases] DROP COLUMN [UnitTestsPassed];

EXEC sp_rename N'[DevelopmentPhases].[Summary]', N'FunctionalRequirements', 'COLUMN';

EXEC sp_rename N'[DevelopmentPhases].[RepositoryUrl]', N'CustomTechnologies', 'COLUMN';

EXEC sp_rename N'[DevelopmentPhases].[Milestones]', N'CustomRequirements', 'COLUMN';

EXEC sp_rename N'[DevelopmentPhases].[IssuesFound]', N'AllowedTechnologies', 'COLUMN';

CREATE TABLE [KanbanItems] (
    [Id] int NOT NULL IDENTITY,
    [DevelopmentPhaseId] int NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [Order] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_KanbanItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_KanbanItems_DevelopmentPhases_DevelopmentPhaseId] FOREIGN KEY ([DevelopmentPhaseId]) REFERENCES [DevelopmentPhases] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_KanbanItems_DevelopmentPhaseId] ON [KanbanItems] ([DevelopmentPhaseId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250310231557_Mig21Kanban', N'9.0.0');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250310234207_Mig22IgnoreDevPhaseKanban', N'9.0.0');

CREATE TABLE [ProjectUsers] (
    [ProjectId] int NOT NULL,
    [ApplicationUserId] nvarchar(450) NOT NULL,
    [RoleInProject] nvarchar(max) NOT NULL,
    [JoinedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_ProjectUsers] PRIMARY KEY ([ProjectId], [ApplicationUserId]),
    CONSTRAINT [FK_ProjectUsers_AspNetUsers_ApplicationUserId] FOREIGN KEY ([ApplicationUserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ProjectUsers_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_ProjectUsers_ApplicationUserId] ON [ProjectUsers] ([ApplicationUserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250323210444_Mig23Teams', N'9.0.0');

COMMIT;
GO

