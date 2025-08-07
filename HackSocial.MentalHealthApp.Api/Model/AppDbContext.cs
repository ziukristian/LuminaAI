using Microsoft.EntityFrameworkCore;

namespace HackSocial.MentalHealthApp.Api.Model;

public class AppDbContext : DbContext
{   
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<JournalEntry> JournalEntries { get; set; } = null!;
    public DbSet<MentalHealthReport> MentalHealthReports { get; set; } = null!;
    public DbSet<Chat> Chats { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);
        modelBuilder.Entity<JournalEntry>()
            .HasKey(ule => ule.Id);
        modelBuilder.Entity<Chat>()
            .HasKey(c => c.Id);
        modelBuilder.Entity<Message>()
            .HasKey(m => m.Id);

        modelBuilder.Entity<MentalHealthReport>()
            .HasKey(mhr => mhr.Id);

        modelBuilder.Entity<User>()
            .HasMany(u => u.MentalHealthReports)
            .WithOne(mhr => mhr.User)
            .HasForeignKey(mhr => mhr.UserId);

        modelBuilder.Entity<User>()
            .HasMany(u => u.JournalEntries)
            .WithOne(ule => ule.User)
            .HasForeignKey(ule => ule.UserId);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Chats)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId);

        modelBuilder.Entity<Chat>()
            .HasMany(c => c.Messages)
            .WithOne(m => m.Chat)
            .HasForeignKey(m => m.ChatId);

    }
}
