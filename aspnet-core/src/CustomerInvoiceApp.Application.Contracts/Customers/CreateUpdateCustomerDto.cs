using System.ComponentModel.DataAnnotations;

namespace CustomerInvoiceApp.Application.Contracts.Customers
{
    public class CreateUpdateCustomerDto
    {
        [Required]
        [StringLength(128)]
        public string Name { get; set; } = null!;

        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(32)]
        public string Phone { get; set; } = null!;

        [Required]
        [StringLength(512)]
        public string BillingAddress { get; set; } = null!;
    }
}
