using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Entities;
using Volo.Abp;
using CustomerInvoiceApp.Application.Contracts.Invoices;
using CustomerInvoiceApp.Invoices;

// Alias to guarantee correct DTO usage
using LineItemDtoContract = CustomerInvoiceApp.Application.Contracts.Invoices.LineItemDto;

namespace CustomerInvoiceApp.Application.Invoices
{
    public class InvoiceAppService :
        CrudAppService<Invoice, InvoiceDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateInvoiceDto>,
        IInvoiceAppService
    {
        private readonly IRepository<Invoice, Guid> _repository;

        public InvoiceAppService(IRepository<Invoice, Guid> repository)
            : base(repository)
        {
            _repository = repository;
        }

        protected override async Task<Invoice> MapToEntityAsync(CreateUpdateInvoiceDto input)
        {
            var invoice = new Invoice(
                Guid.NewGuid(),
                input.CustomerId,
                await GenerateInvoiceNumberAsync(),
                input.InvoiceDate,
                input.DueDate
            );

            foreach (var item in input.LineItems)
            {
                invoice.AddLineItem(new LineItem(
                    Guid.NewGuid(),
                    invoice.Id,
                    item.Description,
                    item.Quantity,
                    item.UnitPrice
                ));
            }

            return invoice;
        }

        public override async Task<InvoiceDto> CreateAsync(CreateUpdateInvoiceDto input)
        {
            var entity = await MapToEntityAsync(input);
            await Repository.InsertAsync(entity, autoSave: true);
            return await GetAsync(entity.Id);
        }

        private InvoiceDto MapToInvoiceDto(Invoice entity)
        {
            var lineItems = entity.LineItems.Select(x =>
            {
                // FIX: Ensure decimal multiplication to match LineTotal type
                decimal lineTotal = x.Quantity * (decimal)x.UnitPrice;

                return new LineItemDtoContract
                {
                    Id = x.Id,
                    InvoiceId = x.InvoiceId,
                    Description = x.Description,
                    Quantity = x.Quantity,
                    UnitPrice = x.UnitPrice,
                    LineTotal = lineTotal
                };
            }).ToList();

            decimal subTotal = lineItems.Sum(x => x.LineTotal);
            decimal tax = subTotal * 0.15m;
            decimal grandTotal = subTotal + tax;

            return new InvoiceDto
            {
                Id = entity.Id,
                CustomerId = entity.CustomerId,
                Number = entity.Number,
                InvoiceDate = entity.InvoiceDate,
                DueDate = entity.DueDate,
                Status = entity.Status,
                SubTotal = subTotal,
                Tax = tax,
                GrandTotal = grandTotal,
                LineItems = lineItems
            };
        }

        public async Task<PagedResultDto<InvoiceDto>> GetFilteredListAsync(
            PagedAndSortedResultRequestDto input,
            Guid? customerId,
            string? status)
        {
            var query = await _repository.GetQueryableAsync();
            IQueryable<Invoice> queryable = query.Include(i => i.LineItems);

            if (customerId.HasValue)
                queryable = queryable.Where(i => i.CustomerId == customerId.Value);

            if (!string.IsNullOrWhiteSpace(status))
                queryable = queryable.Where(i => i.Status == status);

            var totalCount = await AsyncExecuter.CountAsync(queryable);

            var items = await AsyncExecuter.ToListAsync(
                queryable
                    .OrderByDescending(i => i.InvoiceDate)
                    .Skip(input.SkipCount)
                    .Take(input.MaxResultCount)
            );

            return new PagedResultDto<InvoiceDto>(
                totalCount,
                items.Select(MapToInvoiceDto).ToList()
            );
        }

        public override async Task<InvoiceDto> GetAsync(Guid id)
        {
            var query = await _repository.WithDetailsAsync(i => i.LineItems);
            var invoice = await AsyncExecuter.FirstOrDefaultAsync(query.Where(i => i.Id == id));

            if (invoice == null)
                throw new EntityNotFoundException(typeof(Invoice), id);

            return MapToInvoiceDto(invoice);
        }

        public override async Task<InvoiceDto> UpdateAsync(Guid id, CreateUpdateInvoiceDto input)
        {
            var query = await _repository.WithDetailsAsync(i => i.LineItems);
            var invoice = await AsyncExecuter.FirstOrDefaultAsync(query.Where(i => i.Id == id));

            if (invoice == null)
                throw new EntityNotFoundException(typeof(Invoice), id);

            if (invoice.Status == "Paid" || invoice.Status == "Completed")
                throw new UserFriendlyException("Paid or Completed invoices cannot be edited.");

            invoice.UpdateDates(input.InvoiceDate, input.DueDate);
            invoice.LineItems.Clear();

            foreach (var item in input.LineItems)
            {
                invoice.AddLineItem(new LineItem(
                    Guid.NewGuid(),
                    invoice.Id,
                    item.Description,
                    item.Quantity,
                    item.UnitPrice
                ));
            }

            await _repository.UpdateAsync(invoice, autoSave: true);

            return MapToInvoiceDto(invoice);
        }

        public async Task UpdateStatusAsync(Guid id, string status)
        {
            var invoice = await _repository.GetAsync(id);
            invoice.UpdateStatus(status);
            await _repository.UpdateAsync(invoice, autoSave: true);
        }

        private async Task<string> GenerateInvoiceNumberAsync()
        {
            var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
            var count = await _repository.CountAsync();
            var nextNumber = count + 1;

            return $"INV-{datePart}-{nextNumber:0000}";
        }
    }
}
