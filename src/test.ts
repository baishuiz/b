// let Air:any = (<any>window).Air;
import {IfcSampleInterface } from  './ifcSampleInterface';
Air.module("module.name", function(){
    
    class Fn implements IfcSampleInterface{
        key = '';
        value = '123';
  }
  return Fn;
});

Air.run(function(require:any){
    
    let Fn = require('module.name');
    let fn = new Fn();
  });

