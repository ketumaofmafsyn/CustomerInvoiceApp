using CustomerInvoiceApp.Customers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerInvoiceApp.EntityFrameworkCore.Customers;

public class CustomerEntityTypeConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("AppCustomers");

        builder.Property(x => x.Name).IsRequired().HasMaxLength(128);
        builder.Property(x => x.Email).HasMaxLength(256);
        builder.Property(x => x.Phone).HasMaxLength(32);
        builder.Property(x => x.BillingAddress).HasMaxLength(512);
    }
}
