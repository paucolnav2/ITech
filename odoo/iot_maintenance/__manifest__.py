{
    'name': 'IoT Maintenance Tickets',
    'version': '1.0.0',
    'summary': 'Maintenance intervention tickets generated automatically from IoT sensor anomalies.',
    'description': """
        Receives critical anomaly alerts from the Java IoT backend via the Odoo JSON-RPC API
        and creates helpdesk.ticket records that operators can manage and resolve.
    """,
    'category': 'Maintenance',
    'author': 'ITech',
    'depends': ['base', 'mail'],
    'data': [
        'security/ir.model.access.csv',
        'views/helpdesk_ticket_views.xml',
        'views/helpdesk_menu.xml',
    ],
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
