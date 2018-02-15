# Copyright (c) 2018, Frappe and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe


def execute():
    mappers = [
        {
            'doctype': 'Cash Flow Mapper',
            "section_footer": "Net cash generated by operating activities", 
            "section_header": "Cash flows from operating activities", 
            "section_leader": "Adjustments for", 
            "section_name": "Operating Activities", 
            'position': 0,
            "section_subtotal": "Cash generated from operations",
        },
        {
            'doctype': 'Cash Flow Mapper',
            "position": 1, 
            "section_footer": "Net cash used in investing activities", 
            "section_header": "Cash flows from investing activities", 
            "section_name": "Investing Activities"
        },
        {
            'doctype': 'Cash Flow Mapper',
            "position": 2,
            "section_footer": "Net cash used in financing activites",
            "section_header": "Cash flows from financing activities",
            "section_name": "Financing Activities",
        }
    ]

    frappe.reload_doc('accounts', 'doctype', frappe.scrub('Cash Flow Mapper'))

    for mapper in mappers:
        if not frappe.db.exists('Cash Flow Mapper', mapper['section_name']):
            doc = frappe.get_doc(mapper)
            doc.insert(ignore_permissions=True)
