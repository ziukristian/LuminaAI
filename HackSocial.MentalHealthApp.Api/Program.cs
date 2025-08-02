using HackSocial.MentalHealthApp.Api.Model;
using HackSocial.MentalHealthApp.Api.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=app.db"));

builder.Services.AddScoped<UserService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseRouting();

app.UseCors();

app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options
        .WithTitle("Mental health API")
        .WithDefaultHttpClient(ScalarTarget.Node, ScalarClient.Axios);
});


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Users.Any())
    {
        var user = new User
        {
            Id = Guid.Parse("a0da3969-1451-42c6-a807-70ea7fde4d8f"),
            Username = "defaultUser"
        };
        db.Users.Add(user);
        db.SaveChanges();
    }
}

app.Run();
