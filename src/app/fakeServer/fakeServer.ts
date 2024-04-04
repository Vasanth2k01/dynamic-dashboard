interface ServerResponse {
  success: boolean;
  rows: any[];
  lastRow: number;
}

export class FakeServer {
  private data: any[];

  constructor(data: any[]) {
    this.data = data;
  }

  getData(request: any): ServerResponse {
    const startRow = request.startRow;
    const endRow = request.endRow;
    const rows = this.data.slice(startRow, endRow);

    return {
      success: true,
      rows: rows,
      lastRow: this.data.length,
    };
  }
}
