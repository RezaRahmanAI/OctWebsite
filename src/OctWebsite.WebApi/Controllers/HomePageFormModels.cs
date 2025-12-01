using Microsoft.AspNetCore.Http;

namespace OctWebsite.WebApi.Controllers;

public sealed class HomeMetricFormRequest
{
    public string? Label { get; set; }
    public string? Value { get; set; }
    public string? Theme { get; set; }
}

public sealed class HomeStatFormRequest
{
    public string? Label { get; set; }
    public decimal Value { get; set; }
    public string? Suffix { get; set; }
    public int? Decimals { get; set; }
}

public sealed class HomeTrustLogoFormRequest
{
    public IFormFile? Logo { get; set; }
    public string? LogoFileName { get; set; }
}

public sealed class HomeTestimonialFormRequest
{
    public string? Quote { get; set; }
    public string? Name { get; set; }
    public string? Title { get; set; }
    public string? Location { get; set; }
    public int Rating { get; set; }
    public string? Type { get; set; }
    public IFormFile? Image { get; set; }
    public string? ImageFileName { get; set; }
}
