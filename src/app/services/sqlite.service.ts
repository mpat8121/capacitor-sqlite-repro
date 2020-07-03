import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import * as CapacitorSQLPlugin from "capacitor-sqlite";
const { CapacitorSQLite, Device } = Plugins;
import importData from "../models/sql";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { JsonSQLite } from 'capacitor-sqlite/dist/esm/electron-utils/JsonUtils';

@Injectable({
  providedIn: "root",
})
export class SqliteService {
  private sqlite: CapacitorSQLPlugin.CapacitorSQLitePlugin;
  private platform: string;
  private isService: boolean = false;
  public ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private http: HttpClient) {}

  async init(): Promise<boolean> {
    const info = await Device.getInfo();
    this.platform = info.platform;
    if (this.platform === "ios" || this.platform === "android") {
      this.sqlite = CapacitorSQLite;
      this.isService = true;
    }
    return true;
  }

  async initJson(): Promise<void> {
    try {
      const { result } = await this.sqlite.open({ database: "test" });
      if (result) {
        const { tableImport } = importData;
        const tableJson = JSON.stringify(tableImport);
        const validTableString: CapacitorSQLPlugin.capSQLiteResult = await this.sqlite.isJsonValid(
          {
            jsonstring: tableJson,
          }
        );
        if (validTableString.result) {
          const tableResult = await this.sqlite.importFromJson({
            jsonstring: tableJson,
          });
          if (tableResult.changes.changes !== -1) {
            this.ready.next(true);
          }
        }
      }
    } catch (ex) {
      console.error(ex);
      this.ready.next(false);
    }
  }

  async run(statement: string, values?: any[]): Promise<CapacitorSQLPlugin.capSQLiteResult> {
    if (this.isService && statement.length > 0) {
      const result = await this.sqlite.run({ statement, values });
      return result;
    } else {
      return null;
    }
  }

  async syncData() {
    const json = await this.downloadFile();
    const importJson: JsonSQLite = {
      database: "test",
      encrypted: false,
      mode: "full",
      tables: json
    };
    const jsonstring = JSON.stringify(importJson);
    const result = await this.sqlite.importFromJson({jsonstring});
    return result;
  }

  private async downloadFile(): Promise<any> {
    return this.http.get('../models/sync-sql.json', { responseType: "json" }).toPromise();
  }
}
