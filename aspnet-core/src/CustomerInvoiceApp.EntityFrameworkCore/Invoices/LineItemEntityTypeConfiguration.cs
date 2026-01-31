using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace CustomerInvoiceApp.Invoices
{
    public class LineItemEntityTypeConfiguration : IEntityTypeConfiguration<LineItem>
    {
        public void Configure(EntityTypeBuilder<LineItem> builder)
        {
            builder.ToTable("InvoiceLineItems");
            builder.ConfigureByConvention();

            builder.Property(x => x.Description).IsRequired().HasMaxLength(256);
            builder.Property(x => x.Quantity).IsRequired();
            builder.Property(x => x.UnitPrice).IsRequired();
        }
    }
}
