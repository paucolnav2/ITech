from odoo import models, fields, api
from odoo.exceptions import UserError


class HelpdeskTicket(models.Model):
    # The _name must match exactly what the Java OdooClient sends: "helpdesk.ticket"
    _name = 'helpdesk.ticket'
    _description = 'IoT Maintenance Intervention Ticket'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'create_date desc'

    name = fields.Char(string='Subject', required=True, tracking=True)
    description = fields.Text(string='Description')

    state = fields.Selection(
        selection=[
            ('new', 'New'),
            ('opened', 'Opened'),
            ('assigned', 'Assigned'),
            ('in_progress', 'In Progress'),
            ('resolved', 'Resolved'),
            ('cancelled', 'Cancelled'),
        ],
        string='Status',
        default='new',
        required=True,
        tracking=True,
    )

    priority = fields.Selection(
        selection=[
            ('0', 'Normal'),
            ('1', 'High'),
            ('2', 'Critical'),
        ],
        string='Priority',
        default='2',
    )

    assigned_to = fields.Many2one(
        comodel_name='res.users',
        string='Assigned To',
        tracking=True,
    )

    resolution_notes = fields.Text(string='Resolution Notes')

    close_date = fields.Datetime(string='Closed On', readonly=True)

    @api.model_create_multi
    def create(self, vals_list):
        tickets = super().create(vals_list)
        return tickets

    def action_open(self):
        self.write({'state': 'opened'})

    def action_assign(self):
        if not self.assigned_to:
            raise UserError("You must select a technician before assigning the ticket.")
        self.write({'state': 'assigned'})

    def action_start(self):
        self.write({'state': 'in_progress'})

    def action_resolve(self):
        self.write({
            'state': 'resolved',
            'close_date': fields.Datetime.now(),
        })

    def action_cancel(self):
        self.write({'state': 'cancelled'})

    def action_reopen(self):
        self.write({'state': 'new', 'close_date': False})
