using System.Text.Json.Serialization;
using OctWebsite.Application;
using OctWebsite.Infrastructure;
using OctWebsite.Infrastructure.Data;
using OctWebsite.Infrastructure.Identity;
using OctWebsite.WebApi.Security;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();
const string CorsPolicyName = "AllowFrontend";
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        CorsPolicyName,
        policy =>
        {
            if (allowedOrigins.Length > 0)
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            }
            else
            {
                policy.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            }
        });
});
builder.Services
    .AddOptions<JwtOptions>()
    .Bind(builder.Configuration.GetSection("Security:Jwt"))
    .ValidateDataAnnotations()
    .ValidateOnStart();
builder.Services.Configure<AdminUserOptions>(builder.Configuration.GetSection("Security:AdminUser"));
builder.Services.AddSingleton<JwtTokenGenerator>();
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var jwtOptions = builder.Configuration.GetSection("Security:Jwt").Get<JwtOptions>()!;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey))
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

app.Environment.WebRootPath ??= Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(app.Environment.WebRootPath);

var uploadsPath = Path.Combine(app.Environment.WebRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);

await using var scope = app.Services.CreateAsyncScope();
var initializer = scope.ServiceProvider.GetRequiredService<ApplicationDbInitializer>();
await initializer.InitializeAsync();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();
app.UseCors(CorsPolicyName);
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});
app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger", permanent: false)).ExcludeFromDescription();

app.Run();
