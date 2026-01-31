using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace CustomerInvoiceApp.Customers;

public class Customer : FullAuditedAggregateRoot<Guid>
{
    // Properties
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string? Phone { get; set; }
    public string? BillingAddress { get; set; }

    // ✅ CONSTRUCTOR WITH VALIDATION
    public Customer(Guid id, string name, string email) : base(id)
    {
        SetName(name);
        SetEmail(email);
    }

    // ✅ PROTECTED PARAMETERLESS CONSTRUCTOR FOR EF CORE
    protected Customer() { }

    // =========================================================
    // VALIDATION SETTERS
    // =========================================================
    
    /// <summary>
    /// Sets customer name with validation
    /// </summary>
    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required", nameof(name));
        
        if (name.Length > 128)
            throw new ArgumentException("Name cannot exceed 128 characters", nameof(name));
        
        Name = name.Trim();
    }

    /// <summary>
    /// Sets customer email with validation
    /// </summary>
    public void SetEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required", nameof(email));
        
        if (email.Length > 256)
            throw new ArgumentException("Email cannot exceed 256 characters", nameof(email));
        
        if (!email.Contains("@", StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException("Valid email format is required", nameof(email));
        
        Email = email.Trim().ToLowerInvariant();
    }

    /// <summary>
    /// Sets phone number (optional)
    /// </summary>
    public void SetPhone(string? phone)
    {
        Phone = string.IsNullOrWhiteSpace(phone) ? null : phone.Trim();
    }

    /// <summary>
    /// Sets billing address (optional)
    /// </summary>
    public void SetBillingAddress(string? billingAddress)
    {
        BillingAddress = string.IsNullOrWhiteSpace(billingAddress) ? null : billingAddress.Trim();
    }
}