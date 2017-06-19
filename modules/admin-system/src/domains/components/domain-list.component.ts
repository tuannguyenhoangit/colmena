import { Component, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { UiService } from '@colmena/admin-ui'

import { DomainsService } from '../domains.service'

@Component({
  selector: 'app-domain-list',
  template: `
    <ui-data-grid #grid (action)="action($event)" [service]="service"></ui-data-grid>
  `,
})
export class DomainListComponent {

  @ViewChild('grid') private grid

  constructor(
    public service: DomainsService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  action(event) {
    switch (event.action) {
      case 'edit':
      case 'view':
        return this.router.navigate([event.item.id], { relativeTo: this.route.parent })
      case 'add':
        return this.router.navigate(['create'], { relativeTo: this.route.parent })
      case 'delete':
        const successCb = () => this.service
          .deleteItem(event.item,
          () => this.grid.refreshData(),
          (err) => this.uiService.toastError('Error deleting item', err.message))
        const question = { title: 'Are you sure?', text: 'The action can not be undone.' }
        return this.uiService.alertQuestion(question, successCb, () => ({}))
      default:
        return console.log('Unknown event action', event)
    }
  }

}