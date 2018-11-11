import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { HttpService } from 'app/shared/services/http.service';
import { SpinnerService } from 'app/shared/services/spinner.service';
import { MessageService } from 'primeng/components/common/messageservice';

export interface Agent {
  _id: string;
  username: string;
  firstname: string;
  surname: string;
}

@Component({
  selector: 'app-internal-delivery',
  templateUrl: './internal-delivery.component.html',
  styleUrls: ['./internal-delivery.component.css']
})

export class InternalDeliveryComponent implements OnInit {

  isAgentUpdate = false;
  agentCtrl: FormControl;
  filteredAgents: Observable<any[]>;

  agents: Agent[];
  agentSelected: Agent;

  constructor(private httpService: HttpService, private spinnerService: SpinnerService) {
    this.agentCtrl = new FormControl();
   }

  ngOnInit() {
    this.loadAgents(); // loading agents that (status = internal delivery)
    this.loadAgent(); // loading agents that (status = internal delivery)
  }
  async loadAgent() {
    try {
      this.spinnerService.enable();
      const agent = await this.httpService.get('internal_delivery/get_agent').toPromise();
      if (agent && agent.surname) {
        this.agentCtrl.setValue(`${agent.first_name} ${agent.surname}`); // data set into input
      } else {
        this.agentCtrl.setValue(''); // first time agent not set (to be null)
      }
      this.spinnerService.disable();
    } catch (err) {
      throw err;
    }
  }

  async loadAgents() {
    try {
    this.spinnerService.enable();
      let agents = await this.httpService.get('internal_delivery/get_agents').toPromise();
      agents = this.mapData(agents); // data mapped
      this.agents = agents; // data set into input
      this.filterData(); // data filtered
      this.spinnerService.disable();
    } catch (err) {
      throw err;
    }
  }

  filterData() {
    this.filteredAgents = this.agentCtrl.valueChanges
    .pipe(
      startWith(''),
      map(agent => agent ? this.filterAgents(agent) : this.agents.slice())
    );
  }

  mapData(agents = null) {
    if (agents) {
      const agent_mapped = [];
      agents.forEach(a => {
        agent_mapped.push({
          _id: a._id,
          username: a.username,
          firstname: a.first_name,
          surname: a.surname,
        });
      });

      return agent_mapped; // return data mapped
    }
  }

  filterAgents(inputValue: string) {
    return this.agents.filter(agent =>
      agent.surname.toLowerCase().indexOf(inputValue.toLowerCase()) === 0 ||
       agent.firstname.toLowerCase().indexOf(inputValue.toLowerCase()) === 0);
  }

  agentSelect(agent: Agent) {
    this.isAgentUpdate = true;
    this.agentSelected = agent;
  }

  async setAgentForInternalDelivery() {
    try {
      this.spinnerService.enable();
      const agent_id = this.agentSelected._id;
      this.isAgentUpdate = false;
      const set_agent = await this.httpService.post('/internal_delivery/set_agent', {agent_id}).toPromise();

      if (set_agent) {
        this.spinnerService.disable();
      } else {
        this.spinnerService.disable();
      }
    } catch (err) {
      throw err;
    }
  }

}
