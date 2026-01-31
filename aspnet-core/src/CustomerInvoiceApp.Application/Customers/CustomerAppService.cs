using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CustomerInvoiceApp.Application.Contracts.Customers;
using CustomerInvoiceApp.Application.Contracts.Invoices;
using CustomerInvoiceApp.Invoices;
using CustomerInvoiceApp.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

// Use alias to avoid ambiguous LineItemDto
using LineItemDtoContract = CustomerInvoiceApp.Application.Contracts.Invoices.LineItemDto;

namespace CustomerInvoiceApp.Customers;

[Authorize(CustomerInvoiceAppPermissions.Customers.Default)]
public class CustomerAppService :
    CrudAppService<Customer, CustomerDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateCustomerDto>,
    ICustomerAppService
{
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IGuidGenerator _guidGenerator;

    public CustomerAppService(
        IRepository<Customer, Guid> repository,
        IRepository<Invoice, Guid> invoiceRepository,
        IGuidGenerator guidGenerator)
        : base(repository)
    {
        _invoiceRepository = invoiceRepository;
        _guidGenerator = guidGenerator;

        GetPolicyName = CustomerInvoiceAppPermissions.Customers.Default;
        GetListPolicyName = CustomerInvoiceAppPermissions.Customers.Default;
        CreatePolicyName = CustomerInvoiceAppPermissions.Customers.Create;
        UpdatePolicyName = CustomerInvoiceAppPermissions.Customers.Edit;
        DeletePolicyName = CustomerInvoiceAppPermissions.Customers.Delete;
    }

    protected override Customer MapToEntity(CreateUpdateCustomerDto input)
    {
        var customer = new Customer(_guidGenerator.Create(), input.Name, input.Email);
        customer.SetPhone(input.Phone);
        customer.SetBillingAddress(input.BillingAddress);
        return customer;
    }

    protected override void MapToEntity(CreateUpdateCustomerDto input, Customer entity)
    {
        entity.SetName(input.Name);
        entity.SetEmail(input.Email);
        entity.SetPhone(input.Phone);
        entity.SetBillingAddress(input.BillingAddress);
    }

    public async Task<List<InvoiceDto>> GetInvoicesForCustomerAsync(Guid customerId)
    {
        // FIX: Use separate query instead of lambda in WithDetailsAsync
        var query = await _invoiceRepository.WithDetailsAsync(i => i.LineItems);
        var invoices = await AsyncExecuter.ToListAsync(
            query.Where(i => i.CustomerId == customerId)
        );

        return invoices.Select(i =>
        {
            decimal subtotal = i.LineItems.Sum(li => li.Quantity * li.UnitPrice);
            decimal tax = subtotal * 0.15m;
            decimal grandTotal = subtotal + tax;

            return new InvoiceDto
            {
                Id = i.Id,
                CustomerId = i.CustomerId,
                Number = i.Number,
                InvoiceDate = i.InvoiceDate,
                DueDate = i.DueDate,
                Status = i.Status,
                SubTotal = subtotal,
                Tax = tax,
                GrandTotal = grandTotal,
                LineItems = i.LineItems.Select(li => new LineItemDtoContract
                {
                    Id = li.Id,
                    InvoiceId = li.InvoiceId,
                    Description = li.Description,
                    Quantity = (int)li.Quantity,  // FIX: Explicit cast to int
                    UnitPrice = li.UnitPrice,
                    LineTotal = li.Quantity * li.UnitPrice
                }).ToList()
            };
        }).ToList();
    }

    public override async Task DeleteAsync(Guid id)
    {
        var entity = await Repository.GetAsync(id);
        await Repository.DeleteAsync(entity);
    }
}