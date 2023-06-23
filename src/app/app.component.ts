import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent  {

  public data: { year: number; count: number }[] = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 }
  ];


  fileContent: string | undefined;
  chart: Chart<"doughnut"> | undefined;


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.fileContent = reader.result as string;
      this.processFileContent();
    };

    reader.readAsText(file);
  }

  onFileDrop(event: any) {
    event.preventDefault();
    const file: File = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.fileContent = reader.result as string;
      this.processFileContent();
    };

    reader.readAsText(file);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  processFileContent() {
    if (this.fileContent) {
      const parsedData = Papa.parse(this.fileContent, { header: false });
      const data = parsedData.data as string[][];

      // Realizar los cálculos necesarios
      const estadoMaximo = this.calcularEstadoMaximo(data);
      const estadoMinimo = this.calcularEstadoMinimo(data);
      const estadoMasAfectado = this.calcularEstadoMasAfectado(data);
      const datosGrafica = this.calcularDatosGrafica(data);

      // Mostrar los resultados y la gráfica
      console.log('Estado con mayor acumulado:', estadoMaximo);
      console.log('Estado con menor acumulado:', estadoMinimo);
      console.log('Estado más afectado:', estadoMasAfectado);

      this.renderChart(datosGrafica);
    }
  }

  calcularEstadoMaximo(data: string[][]) {
    // Lógica para calcular el estado con el mayor acumulado
    let estadoMaximo = '';
    let maximoAcumulado = -1;

    for (let i = 0; i < data.length; i++) {
      const acumulado = parseInt(data[i][1]);
      if (acumulado > maximoAcumulado) {
        maximoAcumulado = acumulado;
        estadoMaximo = data[i][0];
      }
    }

    return estadoMaximo;
  }

  calcularEstadoMinimo(data: string[][]) {
    // Lógica para calcular el estado con el menor acumulado
    let estadoMinimo = '';
    let minimoAcumulado = Infinity;

    for (let i = 0; i < data.length; i++) {
      const acumulado = parseInt(data[i][1]);
      if (acumulado < minimoAcumulado) {
        minimoAcumulado = acumulado;
        estadoMinimo = data[i][0];
      }
    }

    return estadoMinimo;
  }

  calcularEstadoMasAfectado(data: string[][]) {
    // Lógica para calcular el estado más afectado
    let estadoMasAfectado = '';
    let mayorAfectacion = -1;

    for (let i = 0; i < data.length; i++) {
      const afectacion = parseInt(data[i][2]);
      if (afectacion > mayorAfectacion) {
        mayorAfectacion = afectacion;
        estadoMasAfectado = data[i][0];
      }
    }

    return estadoMasAfectado;
  }

  renderChart(datosGrafica: any) {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: datosGrafica.labels,
        datasets: [
          {
            label: 'Acquisitions by year',
            data: datosGrafica.data
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  calcularDatosGrafica(data: string[][]) {
    // Lógica para calcular los datos de la gráfica
    const labels = data.map(row => row[0]);
    const muertes = data.map(row => parseInt(row[3]));
    const poblacion = data.map(row => parseInt(row[4]));

    const porcentajeMuertes = muertes.map((valor, indice) => {
      return (valor / poblacion[indice]) * 100;
    });

    return {
      labels: labels,
      data: porcentajeMuertes
    };
  }






}
