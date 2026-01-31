using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

using CustomerInvoiceApp.Customers;
using CustomerInvoiceApp.Invoices;

namespace CustomerInvoiceApp.EntityFrameworkCore.Invoices
{
     public class InvoiceEntityTypeConfiguration : IEntityTypeConfiguration<Invoice>
    {
       public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.ToTable("Invoices");
        builder.ConfigureByConvention(); // Auto config base class properties

        builder.Property(x => x.Number).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Status).IsRequired().HasMaxLength(20);

        // Foreign key to Customer
        builder.HasOne<Customer>()
               .WithMany()
               .HasForeignKey("CustomerId")
               .IsRequired();
    }
    }
}
