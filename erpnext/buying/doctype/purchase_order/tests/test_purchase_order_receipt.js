QUnit.module('Buying');

QUnit.test("test: purchase order receipt", function(assert) {
	assert.expect(5);
	let done = assert.async();

	frappe.run_serially([
		() => {
			return frappe.tests.make('Purchase Order', [
				{supplier: 'Test Supplier'},
				{is_subcontracted: 'No'},
				{buying_price_list: 'Test-Buying-USD'},
				{currency: 'USD'},
				{items: [
					[
						{"item_code": 'Test Product 1'},
						{"schedule_date": "2013-08-23"},
						{"expected_delivery_date": "2013-08-27"},
						{"qty": 5},
						{"uom": 'Unit'},
						{"rate": 100},
						{"warehouse": 'Stores - '+frappe.get_abbr(frappe.defaults.get_default("Company"))}
					]
				]},
			]);
		},

		() => {

			// Check supplier and item details
			assert.ok(cur_frm.doc.supplier_name == 'Test Supplier', "Supplier name correct");
			assert.ok(cur_frm.doc.items[0].item_name == 'Test Product 1', "Item name correct");
			assert.ok(cur_frm.doc.items[0].description == 'Test Product 1', "Description correct");
			assert.ok(cur_frm.doc.items[0].qty == 5, "Quantity correct");

		},

		() => frappe.timeout(2),

		() => frappe.tests.click_button('Submit'),
		() => frappe.tests.click_button('Yes'),

		() => frappe.timeout(2),
		() => frappe.click_button('Close'),
		() => frappe.timeout(0.3),

		// Make Purchase Receipt
		() => frappe.click_button('Make'),
		() => frappe.timeout(0.3),

		() => frappe.click_link('Receipt'),
		() => frappe.timeout(2),

		// Save and submit Purchase Receipt
		() => frappe.tests.click_button('Save'),
		() => frappe.timeout(2),
		() => frappe.tests.click_button('Submit'),
		() => frappe.tests.click_button('Yes'),
		() => frappe.timeout(2),

		// View Purchase order in Stock Ledger
		() => frappe.click_button('View'),
		() => frappe.timeout(0.3),

		() => frappe.click_link('Stock Ledger'),
		() => frappe.timeout(2),
		() => frappe.tests.click_button('Refresh'),
		() => frappe.timeout(2),
		() => {
			assert.ok(
				$('div.slick-cell.l2.r2 > a').text().includes('Test Product 1')
				&& $('div.slick-cell.l9.r9 > div').text().includes(5)
				&& $('div.slick-cell.l12.r12 > div').text().includes(433.28),
				"Stock ledger entry correct - " + $('div.slick-cell.l12.r12 > div').text()
			);
		},

		() => done()
	]);
});
