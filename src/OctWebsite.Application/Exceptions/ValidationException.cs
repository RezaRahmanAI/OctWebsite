using System.Collections.ObjectModel;

namespace OctWebsite.Application.Exceptions;

public sealed class ValidationException : Exception
{
    public ValidationException(string message, IReadOnlyDictionary<string, string[]> errors)
        : base(message)
    {
        // Convert IReadOnlyDictionary to IDictionary before passing to ReadOnlyDictionary
        Errors = new ReadOnlyDictionary<string, string[]>(new Dictionary<string, string[]>(errors));
    }

    public IReadOnlyDictionary<string, string[]> Errors { get; }
}
