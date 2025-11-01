using Microsoft.Extensions.DependencyInjection;
using OctWebsite.Application;
using OctWebsite.Infrastructure;
using OctWebsite.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

var app = builder.Build();

await using var scope = app.Services.CreateAsyncScope();
var initializer = scope.ServiceProvider.GetRequiredService<ApplicationDbInitializer>();
await initializer.InitializeAsync();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();
app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger", permanent: false)).ExcludeFromDescription();

app.Run();
