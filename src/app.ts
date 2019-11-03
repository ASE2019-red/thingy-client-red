import { AureliaConfiguration } from 'aurelia-configuration';
import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';

let httpClient = new HttpClient()
httpClient.configure(config => {
  config
    .withBaseUrl('api/')
    })

@autoinject
export class App {
  heading = 'Coffee Counter'
  public message: string = 'Welcome to the coffee counter! Current coffees: ';
  coffeeCounter = 0

    constructor(private config: AureliaConfiguration) {
    }

  getAllCoffees() {
    this.message = 'All coffees:'
    httpClient
      .fetch('coffee')
      .then(response => response.json())
      .then(listOfCoffees => {
        this.coffeeCounter = Object.keys(listOfCoffees).length
        alert('Returned list of coffees:'+listOfCoffees)
      })
      .catch(error => {
        alert('Error getting list of coffees!')
        this.coffeeCounter = 5
      })
    //this.coffeeCounter = 5;
  }

  getAllCoffeesOfMachine(machineId) {
    this.message = 'All coffees of machine '+machineId+':'
    this.coffeeCounter = 3;
  }

  getAllMachines() {

  }

  subscribeToMachine(machineId) {

  }

}
