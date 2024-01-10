import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Max Coffee',
      brand: 'Max Brewery',
      flavors: ['chocolate', 'brownie'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find((item) => item.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeesDto: CreateCoffeeDto) {
    this.coffees.push({ id: 123, ...createCoffeesDto });
  }

  update(id: string, updateCoffeesDto: any) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      //update
      console.log(updateCoffeesDto);
    }
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
