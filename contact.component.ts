

import { 
  Component,
   OnInit 
  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators,FormArray,FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable'
import { ValidationService } from './../../../core/services/validation.service';
import { environment } from './../../../../environments/environment';
import { Email } from '../email';
import { IMG } from '../../../shared/data/SEOimg';
import { TAGS } from '../../../shared/data/SEOtags';
import { TEXTS } from '../../../shared/data/SEOtexts';
import { ContactoService,
  //  MessageService 
  } from '../contacto.service';
import { SharedService } from '../../../core/services/shared.service';
import { Node } from '../mapa/mapa';
import { FlashMessagesService } from 'angular2-flash-messages';
// const API=environment.API;
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  TAG = TAGS.CONTACTO;
  TX = TEXTS.CONTACTO;
  MAP = TEXTS.FOOTER.INFO.MAP;
  ImgsMapa  = IMG.mapaContacto;
  imgMap=this.ImgsMapa.imgMapa;
  altImgMap=this.ImgsMapa.altMapa;
  contactForm: FormGroup;
  public items = [
  {key: 'Apps', value: TEXTS.CONTACTO.FS1},
  {key: 'E-commerce', value: TEXTS.CONTACTO.FS2},
  {key: 'Diseño web', value: TEXTS.CONTACTO.FS3},
  {key: 'Marketing Online', value: TEXTS.CONTACTO.FS4},
  {key: 'Diseño gráfico', value: TEXTS.CONTACTO.FS5}
  ];
  validEmail;
  invalidEmail;
  invalid=false;
    smtp;enviado=false;

  public dataUser = {
    name: '',
    title: '',
    descripcion:'',
  };
  table='messages';
  public spinner:boolean = false;
  public msgError:boolean = false;
  public msgSucces:boolean = false;
  public respuesta = new Email;
  results: any[] = [];
  _url;
  public verMapa:boolean=false;
  nodes: Node[] = [];
  constructor(
    private _activatedRoute:ActivatedRoute,
    private fb: FormBuilder,
    private contactoService: ContactoService, 
    private sharedService:SharedService,
  // public messageService:MessageService,
  // private _flashMessagesService: FlashMessagesService
) {
     
   

      // 1st parameter is a flash message text
      // 2nd parameter is optional. You can pass object with options.
     
    
          this.nodes.push(new Node(1));
      
    }
   public textomapa='nontext';
    changeUrl(section)
    {
          this.sharedService.chageUrl(section);
    }


  ngOnInit() {

    let group = [];

    this.items.forEach((l) => {
      group.push(new FormGroup({
        key: new FormControl(l.key),
        value: new FormControl(l.value),
        checked: new FormControl(false)
      }))});

    let formControlArray = new FormArray(group);

    this.contactForm = new FormGroup({
      items: formControlArray,
      selectedItems: new FormControl(
        this.mapItems(formControlArray.value),
        Validators.required
        ),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
        ]),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^([A-Za-zÑñáéíóúÁÉÍÓÚ ]+)$/),
        Validators.minLength(3),
        Validators.maxLength(50)
        ]),
      phone: new FormControl('', [
        // Validators.required,
        Validators.pattern(/^([0-9-]+)$/),
        Validators.minLength(10),
        Validators.maxLength(12)
        ]),
      subject: new FormControl('', [
        Validators.pattern(/^([A-Za-zÑñáéíóúÁÉÍÓÚ ]+)$/)
        ]),
      message: new FormControl('', [
        Validators.required,
        Validators.pattern(/^([A-Za-zÑñáéíóúÁÉÍÓÚ0-9\n ]+)$/),
        Validators.minLength(8),
        Validators.maxLength(120)
        ])

    });
    formControlArray.valueChanges.subscribe((v) => {
      this.contactForm.controls['selectedItems'].setValue(this.mapItems(v));
    }
    );
  }
  fverMapa(){
    this.verMapa=true;
  
  }
  hovermapa(){
    if(this.verMapa){
      this.textomapa='nontext';
     
    }
    else{
      this.textomapa='showtext';
    }
  
  }
  hoverleave(){
    this.textomapa='nontext';
  }
  mapItems(items) 
  {
    let selectedItems = items.filter((l) => l.checked).map((l) => l.key);
    return selectedItems.length ? selectedItems : null;
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }

  get phone() { return this.contactForm.get('phone'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }
  get selectedItems() {return this.contactForm.get('selectedItems')}

  nextForm(event,object){
    if(event.key=="Enter")
    {

     }

   }
   goNext(event,name){    
     if(event.key=="Enter")
     {
       
       document.getElementById(name).focus();
     }
   }

   onSubmit(formData) {
     const {name, email, message, phone,selectedItems } = this.contactForm.value;
     const date = Date();
     const html = `
     <div>From: ${name}</div>
     <div>Email: <a href="mailto:${email}">${email}</a></div>
     <div>Date: ${date}</div>
     <div>Telefono: ${phone}</div>
     <div>Message: ${message}</div>
     <div>Items: ${selectedItems}</div>
     `;

     console.log(html);
     let formRequest = { name, email, message, date, phone, html, selectedItems };

     this.contactoService.getHeroes(formRequest.email).subscribe(
       response => {
         this.smtp= response.smtp_check;
         console.log(formRequest.email);
         console.log(this.smtp);
         if (this.smtp) {
           this.contactoService.restPost(this.table,formRequest).subscribe();
           this.contactoService.addToSendEmail(this.table,formRequest).subscribe();
           console.log("mensaje enviado");
          
          //  this._flashMessagesService.show('mensaje enviado', 
        //  { cssClass: 'alert-success', timeout: 4000 });
           this.contactForm.reset();

           let group = [];

           this.items.forEach((l) => {
             group.push(new FormGroup({
               key: new FormControl(l.key),
               value: new FormControl(l.value),
               checked: new FormControl(false)
             }))});

           let formControlArray = new FormArray(group);

       
          this.invalid=false;
          return this.enviado=true;
        }
        else{
          
          return this.invalid=true;
        }

      });

   }

 }


