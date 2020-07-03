import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
syncSuccess: boolean;
  constructor(private sql: SqliteService) {

  }

  async ngOnInit() {
    const data = [1, 2, 3, 4, 5];
    for(let i of data) {
      const settings = await this.sql.run(`INSERT INTO Settings(Key, Setting) VALUES(?,?)`, [`email ${i}`,`test${i}@test.com`]);
    }
  }

  async syncData() {
    const syncResult = await this.sql.syncData();
    this.syncSuccess = syncResult.changes.changes !== -1
  }
}
