using Microsoft.EntityFrameworkCore;

namespace HackSocial.MentalHealthApp.Api.Model;

public class AppDbContext : DbContext
{   
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<UserLogEntry> UserLogEntries { get; set; } = null!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<UserLogEntry>()
            .HasKey(ule => ule.Id);

        modelBuilder.Entity<User>()
            .HasMany(u => u.UserLogEntries)
            .WithOne(ule => ule.User)
            .HasForeignKey(ule => ule.UserId);

    }
}
