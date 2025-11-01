using System.Collections.ObjectModel;

namespace OctWebsite.Application.Exceptions;

public sealed class ValidationException : Exception
{
    public ValidationException(string message, IReadOnlyDictionary<string, string[]> errors)
        : base(message)
    {
        Errors = new ReadOnlyDictionary<string, string[]>(errors);
    }

    public IReadOnlyDictionary<string, string[]> Errors { get; }
}
