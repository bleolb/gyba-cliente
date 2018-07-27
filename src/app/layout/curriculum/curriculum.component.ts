import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PostulanteService} from '../../services/postulante.service';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import {Postulante} from '../../models/postulante';
import {AuthService} from '../../services/auth.service';
import {Oferta} from '../../models/oferta';
import {FirebaseBDDService} from '../../services/firebase-bdd.service';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  curriculum: Postulante;
  @ViewChild('encabezadoHojaVida') encabezadoHojaVida: ElementRef;
  @ViewChild('cuerpoHojaVida') cuerpoHojaVida: ElementRef;
  @ViewChild('pieHojaVida') pieHojaVida: ElementRef;


  constructor(
    public postulanteService: PostulanteService,
    private authService: AuthService,
    private firebaseBDDService: FirebaseBDDService) {
  }

  ngOnInit() {
    this.curriculum = new Postulante();
    this.leerCurriculum();
  }

  leerCurriculum() {
    this.firebaseBDDService.firebaseControllerPostulantes.getAll('identificacion', '1720364049')
      .snapshotChanges().subscribe(items => {
      this.curriculum = null;
      items.forEach(element => {
        let itemLeido: Postulante;
        itemLeido = element.payload.val() as Postulante;
        itemLeido.id = element.key;
        this.curriculum = itemLeido;
      });
    });
  }

  imprimir2() {
    html2canvas(this.encabezadoHojaVida.nativeElement).then(canvasEncabezado => {
      const encabezadoHojaDatosImg = canvasEncabezado.toDataURL('image/png');
      html2canvas(this.cuerpoHojaVida.nativeElement).then(canvasCuerpo => {
        const cuerpoHojaDatosImg = canvasCuerpo.toDataURL('image/png');
        html2canvas(this.pieHojaVida.nativeElement).then(canvasPie => {
          const pieHojaDatosImg = canvasPie.toDataURL('image/png');
          const doc = new jsPDF();
          doc.addImage(encabezadoHojaDatosImg, 'PNG', 10, 10, 190, 7);
          doc.addImage(cuerpoHojaDatosImg, 'PNG', 30, 17, 160, 265);
          doc.addImage(pieHojaDatosImg, 'PNG', 10, 288, 190, 7);
          doc.save('CV_' + this.curriculum.identificacion + '.pdf');
        });
      });
    });
  }

  imprimir() {
    return xepOnline.Formatter.Format('curriculum', {render: 'download'});
  }
}