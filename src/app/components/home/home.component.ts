import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;

  fileContent: string | undefined;
  chart: Chart<'pie'> | undefined;
  isLoggedIn: boolean = false;

  file: File | undefined;
  hovered: boolean = false;
  fileSelected: boolean = false;



  ngAfterViewInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    this.isLoggedIn = isLoggedIn === 'true';

    const storedChartData = localStorage.getItem('chartData');
    if (storedChartData) {
      const dataGraph = JSON.parse(storedChartData);
      this.renderChart(dataGraph);
    }

    // Recuperar el nombre del archivo del almacenamiento local
    const storedFile = localStorage.getItem('file');
    if (storedFile) {
      this.file = JSON.parse(storedFile);
      this.processFileContent();
    }
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.file = file;
    const reader = new FileReader();

    reader.onload = () => {
      this.fileContent = reader.result as string;
      this.processFileContent();
    };

    reader.readAsText(file);
    // Al finalizar el procesamiento, guardar los datos del gráfico en el localStorage
    if (this.chart) {
      const chartData = this.chart.data;
      localStorage.setItem('chartData', JSON.stringify(chartData));
    }
  }


  onFileDrop(event: any) {
    event.preventDefault();
    this.hovered = false;
    this.fileSelected = true;
    const file: File = event.dataTransfer.files[0];
    this.file = file;
    const reader = new FileReader();

    reader.onload = () => {
      this.fileContent = reader.result as string;
      this.processFileContent();
    };

    reader.readAsText(file);
    event.target.classList.remove('hover');

    // Guardar el archivo en localStorage
    localStorage.setItem('file', JSON.stringify(file));
  }


  onDragOver(event: any) {
    event.preventDefault();
    this.hovered = true;
    event.target.classList.add('hover');
  }


  onDragLeave(event: any) {
    event.preventDefault();
    this.hovered = false;
    event.target.classList.remove('hover');
  }


  processFileContent() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileContent = reader.result as string;
        const parsedData = Papa.parse(this.fileContent, { header: false });
        const data = parsedData.data as string[][];

        // Realizar los cálculos necesarios
        const dataGraph = this.calculateDataGraph(data);
        this.renderChart(dataGraph);

        // Guardar los datos en localStorage
        localStorage.setItem('chartData', JSON.stringify(dataGraph));

        // Al finalizar el procesamiento, establecer el estado del archivo seleccionado
        this.fileSelected = true;
      };
      reader.readAsText(this.file);
    }
  }


  // Calcular el estado con el mayor acumulado
  calculateStateMax(data: string[][]) {

    let stateMax = '';
    let maxAcum = -1;

    for (let i = 0; i < data.length; i++) {
      const acum = parseInt(data[i][1]);
      if (acum > maxAcum) {
        maxAcum = acum;
        stateMax = data[i][0];
      }
    }

    return stateMax;
  }


  // Calcular el estado con el menor acumulado
  calculateStateMin(data: string[][]) {

    let stateMin = '';
    let minAcum = Infinity;

    for (let i = 0; i < data.length; i++) {
      const acum = parseInt(data[i][1]);
      if (acum < minAcum) {
        minAcum = acum;
        stateMin = data[i][0];
      }
    }

    return stateMin;
  }


  // Calcular el estado más afectado
  calculateStateMostAffected(data: string[][]) {

    let stateMostAffected = '';
    let mayorAfectacion = -1;

    for (let i = 0; i < data.length; i++) {
      const afectacion = parseInt(data[i][2]);
      if (afectacion > mayorAfectacion) {
        mayorAfectacion = afectacion;
        stateMostAffected = data[i][0];
      }
    }

    return stateMostAffected;
  }


  renderChart(dataGraph: any) {
    const ctx = this.chartCanvasRef.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: dataGraph.labels,
          datasets: [
            {
              label: 'Value',
              data: dataGraph.data,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }


  // Calcular los datos de la gráfica
  calculateDataGraph(data: string[][]) {

    const labels = [
      'Estado con mayor acumulado a la fecha',
      'Estado con menor acumulado a la fecha',
      'Estado más afectado a la fecha',
    ];
    const deaths = data.map((row) => parseInt(row[3]));
    const population = data.map((row) => parseInt(row[4]));

    const percentageDeaths = deaths.map((value, index) => {
      return (value / population[index]) * 100;
    });

    const chartData = [
      percentageDeaths[1],
      percentageDeaths[2],
      percentageDeaths[3],
    ];

    return {
      labels: labels,
      data: chartData,
    };
  }
}
