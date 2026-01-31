using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;


namespace CustomerInvoiceApp.Application.Contracts.Invoices
{
    public interface IInvoiceAppService :
        ICrudAppService<
            InvoiceDto,
            Guid,
            PagedAndSortedResultRequestDto,
            CreateUpdateInvoiceDto>
    {
        Task UpdateStatusAsync(Guid id, string status);

        // ✅ FR-I3: Filter by customer and/or status
        Task<PagedResultDto<InvoiceDto>> GetFilteredListAsync(
            PagedAndSortedResultRequestDto input,
            Guid? customerId,
            string? status);
    }
}
