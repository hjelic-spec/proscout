import { v4 as uuid } from 'uuid';
import type { Player, GameLog, ScoutNote, SkillRatings } from './types';

function mp(
  first: string, last: string, dob: string, pos: Player['position'],
  h: number, w: number, team: string, league: Player['league'],
  ag: Player['ageGroup'], nat: string, sk: SkillRatings, pot: number,
  dp: Player['draftProjection'], dy: number, ws?: number, sp?: Player['position'],
): Player {
  const vals = Object.values(sk);
  const ovr = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10);
  const now = new Date().toISOString();
  return { id: uuid(), firstName: first, lastName: last, dateOfBirth: dob, position: pos, secondaryPosition: sp, ageGroup: ag, height: h, weight: w, wingspan: ws, nationality: nat, currentTeam: team, league, skills: sk, overallRating: ovr, potential: pot, draftProjection: dp, draftYear: dy, createdAt: now, updatedAt: now };
}

function mg(pid: string, d: string, opp: string, lg: GameLog['league'], min: number, pts: number, reb: number, ore: number, ast: number, stl: number, blk: number, to: number, pf: number, fgm: number, fga: number, tpm: number, tpa: number, ftm: number, fta: number, pm: number, n = ''): GameLog {
  return { id: uuid(), playerId: pid, date: d, opponent: opp, league: lg, minutes: min, points: pts, rebounds: reb, offRebounds: ore, assists: ast, steals: stl, blocks: blk, turnovers: to, fouls: pf, fgMade: fgm, fgAttempted: fga, threePtMade: tpm, threePtAttempted: tpa, ftMade: ftm, ftAttempted: fta, plusMinus: pm, notes: n };
}

function mn(pid: string, d: string, c: string, t: ScoutNote['type']): ScoutNote {
  return { id: uuid(), playerId: pid, date: d, content: c, type: t };
}

function s(sh: number, tp: number, fi: number, bh: number, pa: number, pd: number, id: number, rb: number, at: number, iq: number, le: number, we: number): SkillRatings {
  return { shooting: sh, threePoint: tp, finishing: fi, ballHandling: bh, passing: pa, perimeterDefense: pd, interiorDefense: id, rebounding: rb, athleticism: at, basketballIQ: iq, leadership: le, workEthic: we };
}

export function generateSeedData() {
  const players: Player[] = [];
  const gameLogs: GameLog[] = [];
  const notes: ScoutNote[] = [];

  function add(p: Player, games: GameLog[], ns: ScoutNote[] = []) {
    players.push(p);
    gameLogs.push(...games);
    notes.push(...ns);
  }

  let p: Player;

  // ======== 2028 DRAFT CLASS (20 players — HS Seniors + AAU) ========

  p = mp('Alijah','Arenas','2008-03-08','SG',193,83,'Chatsworth HS','High School','U18','USA',s(7,7,7,8,6,6,4,4,8,7,6,7),88,'Lottery',2028,198);
  add(p,[mg(p.id,'2026-12-01','Sierra Canyon','High School',32,28,4,1,5,3,0,3,2,10,18,5,9,3,4,0),mg(p.id,'2026-12-08','Mater Dei','High School',32,22,3,0,6,2,0,4,1,8,17,3,8,3,4,0),mg(p.id,'2027-01-10','IMG Academy','High School',32,32,5,1,4,1,0,2,2,12,20,5,10,3,3,0),mg(p.id,'2026-07-15','Team Melo','AAU',32,30,4,1,4,2,0,3,1,11,19,5,10,3,4,0),mg(p.id,'2026-07-18','MoKan Elite','AAU',32,24,3,0,6,3,0,2,2,9,17,4,9,2,3,0)],[mn(p.id,'2027-01-10','Explosive scorer with deep range. Son of Gilbert Arenas.','strength')]);

  p = mp('Tyran','Stokes','2008-05-22','PF',206,100,'Compass Prep','High School','U18','USA',s(5,4,8,5,4,5,8,9,9,6,6,8),90,'Lottery',2028,216);
  add(p,[mg(p.id,'2026-11-18','Link Academy','High School',32,18,14,6,1,1,4,2,3,8,12,0,0,2,4,0),mg(p.id,'2026-12-05','Montverde','High School',32,22,16,5,2,0,5,1,4,10,14,0,1,2,3,0),mg(p.id,'2027-01-14','Prolific Prep','High School',32,16,12,4,3,2,3,2,2,7,10,0,0,2,4,0),mg(p.id,'2026-07-12','Nike Team FL','AAU',32,20,15,5,1,1,4,1,3,9,13,0,0,2,3,0)],[mn(p.id,'2026-12-05','Elite rebounder and rim protector.','strength'),mn(p.id,'2027-01-14','No perimeter game. Limited offensively without jump shot.','weakness')]);

  p = mp('Koa','Peat','2008-01-10','PG',198,92,'Link Academy','High School','U18','USA',s(6,6,7,7,8,6,5,5,8,8,7,8),91,'Lottery',2028,204,'SG');
  add(p,[mg(p.id,'2026-11-20','Montverde','High School',32,20,6,2,8,2,1,3,1,8,15,2,5,2,3,0),mg(p.id,'2026-12-10','IMG Academy','High School',32,24,5,1,6,1,0,2,2,9,16,3,7,3,4,0),mg(p.id,'2027-01-08','Sunrise Christian','High School',32,18,7,3,10,3,1,2,1,7,14,1,4,3,4,0),mg(p.id,'2026-07-20','Brad Beal Elite','AAU',32,22,5,1,7,2,0,3,2,8,15,3,7,3,4,0)],[mn(p.id,'2027-01-08','6\'6 PG. Size + passing. Penny Hardaway comparison.','strength')]);

  p = mp('Jaylen','Shelby','2008-07-15','SF',200,90,'Oak Hill Academy','High School','U18','USA',s(7,6,8,6,5,7,5,7,9,6,6,7),86,'Lottery',2028,208);
  add(p,[mg(p.id,'2026-12-01','Sierra Canyon','High School',32,22,8,3,2,2,2,2,2,9,16,1,4,3,4,0),mg(p.id,'2026-12-15','Montverde','High School',32,18,10,4,3,1,3,3,3,7,15,1,5,3,4,0),mg(p.id,'2027-01-20','Compass Prep','High School',32,26,7,2,4,3,1,1,1,10,17,3,7,3,3,0),mg(p.id,'2026-07-22','Team CP3','AAU',32,24,9,3,3,2,2,2,2,9,16,2,5,4,5,0)]);

  p = mp('Caleb','Wilson','2008-04-18','PG',190,80,'Sierra Canyon','High School','U18','USA',s(7,7,6,8,7,6,3,3,7,7,7,7),84,'First Round',2028,194);
  add(p,[mg(p.id,'2026-12-01','Mater Dei','High School',32,20,3,0,7,3,0,3,1,7,14,3,7,3,4,0),mg(p.id,'2027-01-08','Corona Centennial','High School',32,24,2,0,8,2,0,2,2,9,16,4,8,2,2,0),mg(p.id,'2026-07-14','Compton Magic','AAU',32,18,3,1,6,2,0,3,1,7,14,2,5,2,3,0)]);

  p = mp('Brandon','McCoy','2008-09-10','C',211,105,'Montverde Academy','High School','U18','USA',s(5,4,8,4,4,4,8,9,8,6,6,8),87,'Lottery',2028,218);
  add(p,[mg(p.id,'2026-11-20','IMG Academy','High School',32,18,14,5,1,0,5,2,3,8,12,0,0,2,4,0),mg(p.id,'2026-12-08','Oak Hill','High School',32,22,12,4,2,1,4,1,2,10,14,0,0,2,3,0),mg(p.id,'2026-07-18','E1T1','AAU',32,16,13,5,1,0,6,2,4,7,10,0,0,2,4,0)],[mn(p.id,'2026-12-08','7-footer with great hands and motor. Needs to develop any semblance of a face-up game.','general')]);

  p = mp('Darryn','Thomas','2008-02-28','SF',199,88,'Prolific Prep','High School','U18','USA',s(7,6,7,7,6,6,5,6,8,6,5,7),82,'First Round',2028,204);
  add(p,[mg(p.id,'2026-11-22','Link Academy','High School',32,20,6,2,3,1,1,2,2,8,15,2,5,2,3,0),mg(p.id,'2027-01-10','IMG Academy','High School',32,18,7,2,4,2,1,3,1,7,14,2,6,2,2,0),mg(p.id,'2026-07-16','Compton Magic','AAU',32,22,5,1,3,1,0,2,1,9,16,2,5,2,3,0)]);

  p = mp('Aiden','Knox','2008-06-05','SG',194,84,'IMG Academy','High School','U18','USA',s(7,7,7,7,5,6,4,4,7,7,6,7),83,'First Round',2028,198);
  add(p,[mg(p.id,'2026-11-16','Montverde','High School',32,22,4,1,3,1,0,2,2,8,16,4,8,2,3,0),mg(p.id,'2026-12-10','Oak Hill','High School',32,18,5,1,4,2,0,3,1,7,14,2,6,2,2,0),mg(p.id,'2026-07-20','Team Takeover','AAU',32,26,3,0,3,2,0,2,1,10,18,4,9,2,2,0)]);

  p = mp('Marcus','Allen','2008-08-14','PF',204,96,'Sunrise Christian','High School','U18','USA',s(6,5,7,5,5,6,7,7,8,6,6,7),81,'First Round',2028,210);
  add(p,[mg(p.id,'2026-11-20','Link Academy','High School',32,16,10,4,2,1,2,1,3,7,12,0,1,2,3,0),mg(p.id,'2027-01-08','Compass Prep','High School',32,20,12,5,1,0,3,2,2,9,14,0,0,2,4,0)]);

  p = mp('Jordan','Mitchell','2008-11-02','PG',188,78,'AZ Compass','High School','U18','USA',s(6,6,6,8,7,7,3,3,8,7,6,7),80,'First Round',2028,192);
  add(p,[mg(p.id,'2026-12-01','Prolific Prep','High School',32,16,2,0,8,3,0,4,1,6,13,2,5,2,3,0),mg(p.id,'2027-01-15','Montverde','High School',32,14,3,1,9,2,0,3,2,5,12,2,5,2,2,0),mg(p.id,'2026-07-14','AZ Unity','AAU',32,18,3,0,7,3,0,2,1,7,14,2,5,2,3,0)]);

  p = mp('Devon','Lewis','2008-03-20','SG',196,86,'Brewster Academy','High School','U18','USA',s(8,8,6,6,5,5,4,4,7,6,5,7),82,'First Round',2028,200);
  add(p,[mg(p.id,'2026-11-18','IMG Academy','High School',32,24,3,0,2,1,0,2,1,9,17,4,9,2,2,0),mg(p.id,'2027-01-12','Compass Prep','High School',32,20,4,1,3,2,0,3,2,8,15,3,7,1,1,0)],[mn(p.id,'2027-01-12','Pure shooter. Can fill it up from deep. Defensive effort is inconsistent.','strength')]);

  p = mp('Jamal','Carter','2008-05-15','SF',201,90,'St. Benedict\'s','High School','U18','USA',s(6,6,7,6,5,7,6,6,8,6,6,7),80,'First Round',2028,208);
  add(p,[mg(p.id,'2026-12-05','Blair Academy','High School',32,18,7,2,3,2,2,2,2,7,14,1,3,3,4,0),mg(p.id,'2027-01-18','Patrick School','High School',32,22,8,3,2,1,1,1,1,9,16,2,5,2,3,0)]);

  p = mp('Miles','Robinson','2008-10-30','C',208,100,'Findlay Prep','High School','U18','USA',s(5,4,7,4,4,4,8,8,7,6,5,8),79,'Second Round',2028,215);
  add(p,[mg(p.id,'2026-11-22','Bishop Gorman','High School',28,14,11,4,1,0,4,2,3,6,10,0,0,2,3,0),mg(p.id,'2027-01-10','Coronado','High School',30,16,13,5,2,1,3,1,2,7,11,0,0,2,4,0)]);

  p = mp('Trey','Washington','2008-01-25','PG',191,82,'Wasatch Academy','High School','U18','USA',s(7,6,6,8,8,6,3,3,7,8,7,7),83,'First Round',2028,196);
  add(p,[mg(p.id,'2026-11-20','Montverde','High School',32,16,3,0,9,2,0,3,1,6,13,2,5,2,3,0),mg(p.id,'2027-01-08','IMG Academy','High School',32,20,4,1,7,3,0,2,2,8,15,2,5,2,3,0),mg(p.id,'2026-07-18','Utah Prospects','AAU',32,18,3,0,8,2,0,3,1,7,14,2,6,2,3,0)]);

  p = mp('Quincy','Adams','2008-04-30','SF',202,92,'La Lumiere','High School','U18','USA',s(6,6,7,6,5,7,5,7,8,6,5,7),80,'First Round',2028,208);
  add(p,[mg(p.id,'2026-12-01','Montverde','High School',32,18,8,3,2,2,1,2,2,7,14,2,5,2,3,0),mg(p.id,'2027-01-12','IMG Academy','High School',32,22,7,2,3,1,2,1,1,9,16,2,5,2,3,0)]);

  p = mp('Rasheed','Walker','2008-07-22','SG',195,84,'Huntington Prep','High School','U18','USA',s(7,7,6,7,5,6,4,4,8,6,5,7),79,'Second Round',2028,200);
  add(p,[mg(p.id,'2026-11-18','Oak Hill','High School',32,20,4,1,3,1,0,2,2,8,16,3,7,1,1,0),mg(p.id,'2027-01-15','Link Academy','High School',32,22,3,0,4,2,0,3,1,8,15,4,8,2,2,0)]);

  p = mp('Zion','Crawford','2008-12-05','PF',207,98,'Overtime Elite','High School','U18','USA',s(5,4,8,5,5,5,7,8,9,6,6,7),84,'First Round',2028,214);
  add(p,[mg(p.id,'2026-11-20','Pro16','High School',32,20,12,4,3,1,3,2,3,8,13,0,1,4,5,0),mg(p.id,'2027-01-08','City Reapers','High School',32,18,10,3,2,0,4,1,2,8,12,0,0,2,3,0),mg(p.id,'2026-07-22','ATL Express','AAU',32,22,14,5,2,1,3,1,3,10,15,0,1,2,3,0)],[mn(p.id,'2027-01-08','Explosive finisher. Elite vertical. Raw offensively but upside is through the roof.','strength')]);

  p = mp('Corey','Patterson','2008-08-18','PG',186,76,'Wheeler HS','High School','U18','USA',s(6,6,6,8,7,7,3,3,8,7,6,7),78,'Second Round',2028,190);
  add(p,[mg(p.id,'2026-12-05','Milton HS','High School',32,16,2,0,8,3,0,3,1,6,13,2,5,2,3,0),mg(p.id,'2027-01-18','Norcross HS','High School',32,14,3,1,7,2,0,4,2,5,12,2,5,2,2,0)]);

  p = mp('Derek','Foster','2008-06-28','C',209,102,'Overtime Elite','High School','U18','USA',s(5,3,7,4,4,4,8,8,7,6,5,8),80,'Second Round',2028,216);
  add(p,[mg(p.id,'2026-11-22','Pro16','High School',28,14,12,5,1,0,5,2,3,6,10,0,0,2,4,0),mg(p.id,'2027-01-10','Cold Hearts','High School',30,12,10,4,2,1,4,1,2,5,8,0,0,2,3,0)]);

  p = mp('Nate','Ament','2008-01-22','PG',191,82,'Compass Prep','High School','U18','USA',s(7,7,7,8,7,6,3,3,8,8,7,8),89,'Lottery',2028,196);
  add(p,[mg(p.id,'2026-11-18','Montverde','High School',32,24,4,1,8,3,0,2,1,9,16,4,8,2,2,0),mg(p.id,'2026-12-10','IMG Academy','High School',32,28,3,0,7,2,0,3,2,10,18,5,9,3,3,0),mg(p.id,'2027-01-14','Link Academy','High School',32,22,5,1,6,3,0,2,1,8,15,4,8,2,2,0),mg(p.id,'2026-07-16','AZ Unity','AAU',32,26,4,0,9,2,0,2,1,10,18,4,8,2,2,0)],[mn(p.id,'2027-01-14','Elite floor general. Controls tempo and makes everyone better. Top PG in 2028 class.','strength')]);

  p = mp('Isaiah','Elohim','2008-06-14','SG',196,86,'Sierra Canyon','High School','U18','USA',s(8,8,7,7,5,5,4,4,8,7,6,7),87,'Lottery',2028,200);
  add(p,[mg(p.id,'2026-11-20','Mater Dei','High School',32,30,4,1,3,2,0,2,1,11,19,5,10,3,4,0),mg(p.id,'2026-12-08','Corona Centennial','High School',32,26,5,2,4,1,0,3,2,10,17,4,8,2,2,0),mg(p.id,'2027-01-10','Chatsworth','High School',32,22,3,0,5,2,0,2,1,8,15,3,7,3,4,0),mg(p.id,'2026-07-20','Compton Magic','AAU',32,28,4,1,3,2,0,2,1,10,18,5,10,3,3,0)],[mn(p.id,'2027-01-10','Lethal three-point shooter with NBA range. Smooth stroke and quick release.','strength')]);

  p = mp('Braylon','Mullins','2008-04-08','SF',201,90,'Link Academy','High School','U18','USA',s(7,6,8,7,6,6,5,6,9,7,6,7),88,'Lottery',2028,206);
  add(p,[mg(p.id,'2026-11-22','Sunrise Christian','High School',32,24,8,3,4,2,1,2,2,9,16,2,5,4,5,0),mg(p.id,'2026-12-10','Montverde','High School',32,22,7,2,5,1,2,3,1,8,15,3,7,3,3,0),mg(p.id,'2027-01-08','IMG Academy','High School',32,28,9,3,3,2,1,1,1,11,18,3,7,3,3,0),mg(p.id,'2026-07-14','Brad Beal Elite','AAU',32,26,8,3,4,2,2,2,2,10,17,2,5,4,5,0)],[mn(p.id,'2027-01-08','Two-way wing with elite athleticism. Versatile scorer who can guard 1-4.','strength')]);

  p = mp('Jasper','Johnson','2008-09-20','SG',194,84,'Sunrise Christian','High School','U18','USA',s(8,8,6,7,6,6,4,4,7,7,6,7),86,'Lottery',2028,198);
  add(p,[mg(p.id,'2026-11-18','Link Academy','High School',32,26,3,0,4,2,0,2,1,10,18,4,9,2,2,0),mg(p.id,'2026-12-05','Compass Prep','High School',32,24,4,1,3,1,0,3,2,9,16,4,8,2,2,0),mg(p.id,'2027-01-12','Montverde','High School',32,28,5,1,5,2,0,2,1,10,17,5,10,3,3,0),mg(p.id,'2026-07-18','MoKan Elite','AAU',32,22,3,0,4,2,0,2,1,8,15,4,8,2,2,0)],[mn(p.id,'2027-01-12','Pure shooter with deep range. Shot creation is elite for his age.','strength')]);

  p = mp('Jalen','Haralson','2008-02-15','SF',200,88,'Prolific Prep','High School','U18','USA',s(7,6,7,7,6,7,5,6,8,7,6,7),85,'Lottery',2028,206);
  add(p,[mg(p.id,'2026-11-20','IMG Academy','High School',32,20,7,2,5,2,2,2,2,8,14,2,5,2,3,0),mg(p.id,'2026-12-08','Montverde','High School',32,24,8,3,4,1,1,1,1,9,16,3,7,3,3,0),mg(p.id,'2027-01-14','Link Academy','High School',32,22,6,2,6,3,1,2,2,8,15,3,7,3,3,0),mg(p.id,'2026-07-22','Team Thad','AAU',32,18,9,3,3,1,2,2,2,7,14,2,5,2,3,0)],[mn(p.id,'2027-01-14','Strong two-way wing. Good size and defensive instincts. Improving jumper.','strength')]);

  p = mp('AJ','James','2008-11-18','SF',199,86,'Chatsworth HS','High School','U18','USA',s(6,6,7,7,6,6,5,6,8,6,5,7),82,'First Round',2028,204);
  add(p,[mg(p.id,'2026-12-01','Sierra Canyon','High School',32,18,6,2,4,2,1,2,2,7,14,2,5,2,3,0),mg(p.id,'2027-01-10','Mater Dei','High School',32,22,7,2,3,1,1,1,1,8,15,3,6,3,4,0),mg(p.id,'2026-07-14','Compton Magic','AAU',32,20,7,3,4,2,1,2,2,8,14,2,5,2,3,0)]);

  p = mp('Omari','Bradley','2008-03-14','PG',192,82,'Wheeler HS','High School','U18','USA',s(7,7,6,8,7,6,3,3,8,7,7,7),84,'First Round',2028,196);
  add(p,[mg(p.id,'2026-12-05','Milton HS','High School',32,22,3,0,8,3,0,2,1,8,16,4,8,2,2,0),mg(p.id,'2027-01-18','Norcross HS','High School',32,20,4,1,7,2,0,3,2,8,15,2,5,2,3,0),mg(p.id,'2026-07-16','ATL Express','AAU',32,18,3,0,9,3,0,2,1,7,14,2,5,2,3,0)]);

  p = mp('Jayden','Quaintance','2008-05-10','PF',205,96,'IMG Academy','High School','U18','USA',s(6,5,8,5,5,6,8,8,9,7,6,8),88,'Lottery',2028,212);
  add(p,[mg(p.id,'2026-11-20','Montverde','High School',32,18,12,5,2,1,5,2,3,8,12,0,0,2,4,0),mg(p.id,'2026-12-10','Oak Hill','High School',32,22,14,5,1,0,4,1,2,10,14,0,1,2,3,0),mg(p.id,'2027-01-08','Link Academy','High School',32,20,10,4,3,2,6,2,4,9,13,0,0,2,3,0),mg(p.id,'2026-07-20','Nike Team FL','AAU',32,16,11,4,2,1,4,1,3,7,10,0,0,2,4,0)],[mn(p.id,'2027-01-08','Elite shot-blocker with massive wingspan. Defensive anchor who runs the floor.','strength')]);

  p = mp('Trentyn','Flowers','2008-07-22','SG',195,84,'Prolific Prep','High School','U18','USA',s(7,7,7,7,6,6,4,4,8,6,6,7),83,'First Round',2028,200);
  add(p,[mg(p.id,'2026-11-18','Compass Prep','High School',32,24,4,1,4,2,0,2,1,9,16,4,8,2,2,0),mg(p.id,'2026-12-08','IMG Academy','High School',32,20,5,1,3,1,0,3,2,8,15,2,6,2,3,0),mg(p.id,'2027-01-12','Montverde','High School',32,26,3,0,5,2,0,2,1,10,17,4,8,2,2,0)]);

  p = mp('Meleek','Thomas','2008-01-05','SG',194,84,'Overtime Elite','High School','U18','USA',s(7,7,7,8,7,6,4,4,8,8,7,8),90,'Lottery',2028,198,'SF');
  add(p,[mg(p.id,'2026-11-22','Pro16','High School',32,28,4,1,7,2,0,2,1,10,18,5,9,3,3,0),mg(p.id,'2026-12-10','City Reapers','High School',32,32,5,1,6,3,0,3,2,12,20,5,10,3,4,0),mg(p.id,'2027-01-14','Cold Hearts','High School',32,26,3,0,8,2,0,2,1,10,17,3,7,3,4,0),mg(p.id,'2026-07-18','ATL Express','AAU',32,30,4,0,7,3,0,2,1,11,19,5,9,3,3,0)],[mn(p.id,'2027-01-14','Elite two-way wing. Physical combo guard who can score at all three levels.','strength')]);

  p = mp('Bryson','Tiller Jr','2008-10-05','SF',201,88,'Duncanville HS','High School','U18','USA',s(6,6,7,6,5,7,5,6,8,6,6,7),81,'First Round',2028,206);
  add(p,[mg(p.id,'2026-12-01','Allen HS','High School',32,18,7,2,3,1,2,2,2,7,14,2,5,2,3,0),mg(p.id,'2027-01-10','North Crowley','High School',32,20,8,3,2,2,1,1,1,8,15,2,5,2,3,0)]);

  p = mp('Nikolas','Khamenia','2008-04-28','SF',200,90,'Harvard-Westlake','High School','U18','USA',s(7,7,7,7,6,6,5,5,7,8,6,8),85,'Lottery',2028,204);
  add(p,[mg(p.id,'2026-11-20','Sierra Canyon','High School',32,22,6,2,5,2,1,2,1,8,15,3,7,3,4,0),mg(p.id,'2026-12-08','Mater Dei','High School',32,20,7,2,4,1,1,1,1,8,14,2,5,2,3,0),mg(p.id,'2027-01-12','Chatsworth','High School',32,24,5,1,6,2,0,2,2,9,16,3,7,3,4,0),mg(p.id,'2026-07-20','Compton Magic','AAU',32,18,6,2,4,1,1,2,2,7,14,2,5,2,3,0)],[mn(p.id,'2027-01-12','High IQ wing with polished all-around game. Efficient scorer.','strength')]);

  p = mp('Jaxon','Richardson','2008-12-15','C',210,104,'Montverde Academy','High School','U18','USA',s(5,4,8,4,4,4,8,9,8,6,5,8),84,'Lottery',2028,218);
  add(p,[mg(p.id,'2026-12-08','IMG Academy','High School',30,16,14,5,1,0,5,2,3,7,10,0,0,2,4,0),mg(p.id,'2027-01-15','Link Academy','High School',32,20,16,6,2,1,4,1,2,9,13,0,0,2,3,0)]);

  p = mp('Niko','Bundalo','2008-08-25','PF',206,100,'Compass Prep','High School','U18','USA',s(7,5,8,5,5,5,7,8,8,7,7,8),89,'Lottery',2028,212);
  add(p,[mg(p.id,'2026-11-18','Link Academy','High School',32,24,12,4,3,1,2,1,2,10,15,1,3,3,4,0),mg(p.id,'2026-12-05','Montverde','High School',32,20,10,4,4,0,3,2,3,8,13,1,3,3,4,0),mg(p.id,'2027-01-10','IMG Academy','High School',32,26,14,5,3,1,2,1,2,11,16,1,3,3,3,0),mg(p.id,'2026-07-14','AZ Unity','AAU',32,22,11,4,3,1,3,2,3,9,14,1,2,2,3,0)],[mn(p.id,'2027-01-10','Skilled PF with scoring versatility and great motor. Developing face-up game.','strength')]);

  // ======== 2029 DRAFT CLASS (25+ players — HS Juniors) ========

  p = mp('Kiyan','Anthony','2009-03-07','SF',198,88,'Long Island Lutheran','High School','U18','USA',s(7,7,7,7,5,5,4,5,8,6,6,7),83,'First Round',2029,204);
  add(p,[mg(p.id,'2026-12-05','Brewster Academy','High School',32,26,5,1,3,1,0,2,2,10,18,4,8,2,3,0),mg(p.id,'2027-01-10','IMG Academy','High School',32,22,4,1,2,2,0,3,1,8,16,3,7,3,4,0),mg(p.id,'2027-01-22','St. Benedict\'s','High School',32,30,6,2,4,1,1,2,2,11,19,5,9,3,4,0),mg(p.id,'2026-07-10','PSA Cardinals','AAU',32,28,4,1,3,2,0,3,2,10,18,5,9,3,3,0),mg(p.id,'2026-07-14','Drive Nation','AAU',32,20,5,2,5,1,0,2,1,7,15,3,8,3,4,0)],[mn(p.id,'2027-01-22','Son of Carmelo. Natural scorer with deep range. Needs defensive improvement.','general')]);

  p = mp('Marcus','Johnson','2009-06-20','C',208,102,'Montverde Academy','High School','U18','USA',s(5,4,8,4,5,5,8,9,8,7,6,8),85,'Lottery',2029,216);
  add(p,[mg(p.id,'2026-12-08','IMG Academy','High School',28,16,14,5,2,0,5,2,3,7,10,0,0,2,3,0),mg(p.id,'2027-01-15','Link Academy','High School',30,20,16,6,1,1,4,1,2,9,13,0,0,2,4,0),mg(p.id,'2026-07-18','E1T1','AAU',28,18,12,4,2,0,6,2,4,8,11,0,0,2,3,0)],[mn(p.id,'2027-01-15','Best big in 2029. Rim protection + rebounding elite. Developing hook shot.','strength')]);

  p = mp('Jayden','Williams','2009-09-12','PG',188,78,'Sierra Canyon','High School','U18','USA',s(7,7,6,9,7,6,3,3,8,7,7,7),84,'First Round',2029,192);
  add(p,[mg(p.id,'2026-11-20','Mater Dei','High School',32,22,2,0,8,3,0,3,1,8,16,4,8,2,2,0),mg(p.id,'2027-01-08','Chatsworth','High School',32,18,3,1,7,2,0,4,2,6,14,3,7,3,4,0),mg(p.id,'2026-07-22','Strive for Greatness','AAU',32,24,3,0,6,2,0,2,1,9,16,4,8,2,2,0)],[mn(p.id,'2027-01-08','Best handles in the 2029 class. Shifty and creative.','strength')]);

  p = mp('Trey','Anderson','2009-04-15','SG',195,84,'Duncanville HS','High School','U18','USA',s(7,7,7,7,5,6,4,4,8,6,5,7),82,'First Round',2029,200);
  add(p,[mg(p.id,'2026-12-01','Allen HS','High School',32,24,4,1,3,2,0,2,1,9,16,4,8,2,2,0),mg(p.id,'2027-01-12','North Crowley','High School',32,20,5,1,4,1,0,3,2,8,15,2,6,2,3,0),mg(p.id,'2026-07-16','Texas Titans','AAU',32,26,4,0,3,2,0,2,1,10,18,4,8,2,2,0)]);

  p = mp('Malik','Brown','2009-01-28','PF',205,95,'Oak Hill Academy','High School','U18','USA',s(6,5,7,5,5,6,7,8,8,6,6,7),83,'First Round',2029,212);
  add(p,[mg(p.id,'2026-11-18','Montverde','High School',32,18,12,4,2,1,3,2,3,8,13,0,1,2,3,0),mg(p.id,'2027-01-14','Link Academy','High School',32,16,10,3,3,1,2,1,2,7,12,0,1,2,4,0),mg(p.id,'2026-07-15','Team Takeover','AAU',32,20,11,4,2,0,3,2,3,9,14,0,0,2,3,0)]);

  p = mp('Chris','Parker','2009-07-08','SG',191,80,'Mater Dei','High School','U18','USA',s(7,8,6,7,5,5,3,3,7,6,5,7),80,'First Round',2029,196);
  add(p,[mg(p.id,'2026-12-08','Sierra Canyon','High School',32,22,3,0,4,2,0,2,1,8,16,4,8,2,2,0),mg(p.id,'2027-01-20','Chatsworth','High School',32,26,4,1,3,1,0,3,2,10,18,4,9,2,2,0),mg(p.id,'2026-07-20','Compton Magic','AAU',32,24,3,0,2,1,0,2,1,9,16,5,10,1,1,0)],[mn(p.id,'2027-01-20','Lethal from three. Shot is pure. Needs to add strength.','strength')]);

  p = mp('DeShawn','Harris','2009-11-15','PG',186,76,'Compass Prep','High School','U18','USA',s(6,6,6,8,8,6,3,3,8,7,7,7),81,'First Round',2029,190);
  add(p,[mg(p.id,'2026-11-20','Prolific Prep','High School',32,14,2,0,9,3,0,3,1,5,12,2,5,2,3,0),mg(p.id,'2027-01-10','IMG Academy','High School',32,16,3,0,8,2,0,2,2,6,13,2,5,2,3,0),mg(p.id,'2026-07-14','Arizona Select','AAU',32,18,3,1,10,3,0,2,1,7,14,2,5,2,3,0)]);

  p = mp('Andre','Davis','2009-05-20','SF',200,88,'IMG Academy','High School','U18','USA',s(6,6,7,6,5,7,5,6,8,6,5,7),80,'First Round',2029,206);
  add(p,[mg(p.id,'2026-12-01','Montverde','High School',32,18,7,2,3,2,2,2,2,7,14,1,3,3,4,0),mg(p.id,'2027-01-18','Sunrise Christian','High School',32,20,8,3,2,1,1,1,1,8,15,2,5,2,3,0)]);

  p = mp('Tyler','Green','2009-08-30','C',210,105,'Link Academy','High School','U18','USA',s(4,3,7,4,4,4,8,8,7,6,5,8),79,'Second Round',2029,217);
  add(p,[mg(p.id,'2026-11-22','Sunrise Christian','High School',28,12,10,4,1,0,4,2,3,5,8,0,0,2,4,0),mg(p.id,'2027-01-08','IMG Academy','High School',30,14,12,5,1,1,5,1,2,6,9,0,0,2,3,0)]);

  p = mp('Ryan','Thompson','2009-02-18','SG',193,82,'Corona Centennial','High School','U18','USA',s(7,7,6,6,5,6,4,4,7,6,5,7),78,'Second Round',2029,198);
  add(p,[mg(p.id,'2026-12-05','Mater Dei','High School',32,20,4,1,3,1,0,2,2,8,16,3,7,1,1,0),mg(p.id,'2027-01-12','Sierra Canyon','High School',32,16,3,0,4,2,0,3,1,6,13,2,5,2,3,0)]);

  p = mp('Elijah','Morris','2009-10-05','PF',204,94,'Montverde Academy','High School','U18','USA',s(6,5,8,5,5,6,7,7,8,7,6,7),82,'First Round',2029,210);
  add(p,[mg(p.id,'2026-12-08','IMG Academy','High School',32,18,10,3,2,1,3,2,3,8,13,0,0,2,3,0),mg(p.id,'2027-01-15','Oak Hill','High School',32,20,12,4,3,0,2,1,2,9,14,0,1,2,3,0),mg(p.id,'2026-07-18','Team Thad','AAU',32,16,11,4,2,1,3,2,3,7,11,0,0,2,4,0)]);

  p = mp('Kevin','Washington','2009-03-30','PG',189,78,'Sunrise Christian','High School','U18','USA',s(7,6,6,7,7,6,3,3,7,7,6,7),79,'Second Round',2029,194);
  add(p,[mg(p.id,'2026-11-20','Link Academy','High School',32,16,3,0,7,2,0,3,1,6,14,2,5,2,3,0),mg(p.id,'2027-01-08','Compass Prep','High School',32,18,2,0,6,3,0,2,2,7,14,2,5,2,3,0)]);

  p = mp('Terrance','White','2009-06-12','SF',199,86,'Wasatch Academy','High School','U18','USA',s(6,6,7,6,5,6,5,6,8,6,5,7),78,'Second Round',2029,204);
  add(p,[mg(p.id,'2026-12-01','IMG Academy','High School',32,16,6,2,3,1,1,2,2,6,13,2,5,2,3,0),mg(p.id,'2027-01-12','Montverde','High School',32,18,7,2,2,2,1,1,1,7,14,2,5,2,3,0)]);

  p = mp('Jalen','Price','2009-08-25','SG',194,82,'La Lumiere','High School','U18','USA',s(7,7,6,6,5,5,4,4,7,6,5,7),77,'Second Round',2029,198);
  add(p,[mg(p.id,'2026-11-22','Montverde','High School',32,20,3,0,3,1,0,2,1,8,16,3,7,1,1,0),mg(p.id,'2027-01-10','Oak Hill','High School',32,18,4,1,2,2,0,3,2,7,14,2,6,2,3,0)]);

  p = mp('Noah','Carter','2009-12-10','C',207,100,'Oak Hill Academy','High School','U18','USA',s(5,4,7,4,4,5,7,8,7,6,5,7),78,'Second Round',2029,214);
  add(p,[mg(p.id,'2026-12-05','Link Academy','High School',28,12,10,4,1,0,4,2,3,5,8,0,0,2,4,0),mg(p.id,'2027-01-14','Montverde','High School',30,16,12,5,2,1,3,1,2,7,11,0,0,2,3,0)]);

  p = mp('Damari','Robinson','2009-04-02','PG',187,76,'Prolific Prep','High School','U18','USA',s(6,5,6,8,7,6,3,3,8,7,6,7),79,'Second Round',2029,192);
  add(p,[mg(p.id,'2026-11-20','Compass Prep','High School',32,14,2,0,8,3,0,4,1,5,12,2,5,2,3,0),mg(p.id,'2027-01-08','IMG Academy','High School',32,16,3,0,7,2,0,3,2,6,13,2,5,2,3,0)]);

  p = mp('Xavier','Collins','2009-09-18','PF',203,92,'St. Benedict\'s','High School','U18','USA',s(6,5,7,5,5,6,6,7,8,6,5,7),77,'Second Round',2029,209);
  add(p,[mg(p.id,'2026-12-05','Blair Academy','High School',32,14,8,3,2,1,2,2,2,6,12,0,1,2,4,0),mg(p.id,'2027-01-18','Patrick School','High School',32,18,10,4,1,0,2,1,3,8,14,0,1,2,3,0)]);

  p = mp('Isaiah','Bell','2009-01-08','SG',192,80,'Huntington Prep','High School','U18','USA',s(6,6,6,7,5,6,4,4,7,6,5,7),76,'Second Round',2029,196);
  add(p,[mg(p.id,'2026-11-18','Oak Hill','High School',32,16,3,0,4,2,0,3,2,6,13,2,5,2,3,0),mg(p.id,'2027-01-12','Link Academy','High School',32,14,4,1,3,1,0,2,1,5,12,2,5,2,3,0)]);

  p = mp('Bryce','James','2009-06-14','SF',196,82,'Sierra Canyon','High School','U18','USA',s(6,6,7,7,6,6,5,5,7,7,6,7),82,'First Round',2029,202);
  add(p,[mg(p.id,'2026-11-20','Mater Dei','High School',32,18,5,1,4,2,1,2,2,7,14,2,5,2,3,0),mg(p.id,'2026-12-08','Corona Centennial','High School',32,16,6,2,3,1,2,3,1,6,13,2,5,2,3,0),mg(p.id,'2027-01-12','Chatsworth','High School',32,20,7,2,5,1,1,1,1,8,15,2,5,2,3,0),mg(p.id,'2026-07-18','Strive for Greatness','AAU',32,22,6,2,4,2,1,2,2,8,15,3,6,3,4,0)],[mn(p.id,'2027-01-12','Son of LeBron James. Strong two-way player with great basketball IQ.','general')]);

  p = mp('Tajh','Ariza','2009-08-22','SF',198,86,'Westchester HS','High School','U18','USA',s(6,6,7,6,5,7,5,6,8,6,5,7),80,'First Round',2029,204);
  add(p,[mg(p.id,'2026-12-01','Chatsworth','High School',32,16,7,2,3,1,2,2,2,6,13,2,5,2,3,0),mg(p.id,'2027-01-10','Sierra Canyon','High School',32,20,8,3,2,2,1,1,1,8,15,2,5,2,3,0),mg(p.id,'2026-07-14','Compton Magic','AAU',32,18,6,2,4,1,1,2,2,7,14,2,5,2,3,0)],[mn(p.id,'2027-01-10','Son of Trevor Ariza. Long wingspan, excellent defender. Offensive game developing.','general')]);

  p = mp('Jayden','Moore','2009-03-18','PG',190,80,'St. John Bosco','High School','U18','USA',s(7,6,6,8,8,6,3,3,8,7,7,7),83,'First Round',2029,194);
  add(p,[mg(p.id,'2026-11-18','Mater Dei','High School',32,18,3,0,9,3,0,3,1,7,14,2,5,2,3,0),mg(p.id,'2026-12-10','Sierra Canyon','High School',32,22,4,1,7,2,0,2,2,8,16,4,8,2,2,0),mg(p.id,'2027-01-14','Corona Centennial','High School',32,20,3,0,8,3,0,2,1,8,15,2,5,2,3,0),mg(p.id,'2026-07-20','Team Melo','AAU',32,16,2,0,10,2,0,3,1,6,13,2,5,2,3,0)],[mn(p.id,'2027-01-14','Elite court vision and passing. True PG who makes everyone around him better.','strength')]);

  p = mp('Cavan','Reilly','2009-05-10','SG',195,84,'IMG Academy','High School','U18','USA',s(7,7,7,7,5,6,4,4,8,6,5,7),81,'First Round',2029,200);
  add(p,[mg(p.id,'2026-12-05','Montverde','High School',32,22,4,1,3,1,0,2,1,8,16,4,8,2,2,0),mg(p.id,'2027-01-18','Oak Hill','High School',32,26,5,1,4,2,0,3,2,10,18,4,9,2,2,0),mg(p.id,'2026-07-16','Team Takeover','AAU',32,24,3,0,3,2,0,2,1,9,16,4,8,2,2,0)]);

  p = mp('Tounde','Yessoufou','2009-11-28','SF',201,90,'NBA Academy Africa','AAU','U18','BEN',s(6,5,8,6,4,7,6,7,9,6,5,8),84,'First Round',2029,208);
  add(p,[mg(p.id,'2026-12-01','Team World','AAU',32,20,8,3,2,1,3,2,2,8,14,1,3,3,4,0),mg(p.id,'2027-01-10','Team Africa','AAU',32,24,10,4,3,2,2,1,1,10,16,2,5,2,3,0),mg(p.id,'2026-07-14','Team Thad','AAU',32,22,9,3,2,1,2,2,2,9,15,2,5,2,3,0)],[mn(p.id,'2027-01-10','Benin native with elite athleticism and defensive versatility. Physical freak.','strength')]);

  p = mp('Brayden','Burries','2009-06-14','PG',191,82,'Link Academy','High School','U18','USA',s(7,7,6,8,8,6,3,3,7,7,7,7),85,'Lottery',2029,196);
  add(p,[mg(p.id,'2026-11-18','Montverde','High School',32,20,3,0,8,3,0,2,1,8,15,2,5,2,3,0),mg(p.id,'2026-12-05','IMG Academy','High School',32,18,4,1,7,2,0,3,2,7,14,2,5,2,3,0),mg(p.id,'2027-01-10','Sunrise Christian','High School',32,22,3,0,9,2,0,2,1,8,16,4,8,2,2,0),mg(p.id,'2026-07-14','MoKan Elite','AAU',32,16,2,0,8,3,0,3,1,6,13,2,5,2,3,0)],[mn(p.id,'2027-01-10','Elite facilitator with great court vision and leadership.','strength')]);

  p = mp('Cameron','Scott','2009-01-21','PF',204,96,'Montverde Academy','High School','U18','USA',s(7,6,8,6,5,7,7,7,8,8,7,8),89,'Lottery',2029,210);
  add(p,[mg(p.id,'2026-11-20','IMG Academy','High School',32,22,10,4,4,2,3,2,2,9,14,1,3,3,4,0),mg(p.id,'2026-12-08','Oak Hill','High School',32,26,12,4,3,1,2,1,1,10,16,2,5,2,3,0),mg(p.id,'2027-01-14','Link Academy','High School',32,24,9,3,5,2,4,2,3,10,15,1,2,3,4,0),mg(p.id,'2026-07-18','E1T1','AAU',32,20,11,4,3,1,3,2,3,8,13,1,3,3,4,0)],[mn(p.id,'2027-01-14','Most complete player in the 2029 class. Two-way force who can guard multiple positions.','strength')]);

  p = mp('Davin','Newson','2009-04-18','SF',199,86,'Overtime Elite','High School','U18','USA',s(7,7,7,7,5,6,5,5,8,6,5,7),82,'First Round',2029,204);
  add(p,[mg(p.id,'2026-11-22','Pro16','High School',32,22,6,2,3,1,1,2,2,8,15,3,7,3,3,0),mg(p.id,'2027-01-08','City Reapers','High School',32,20,7,2,4,2,1,1,1,8,14,2,5,2,3,0),mg(p.id,'2026-07-14','ATL Express','AAU',32,24,5,1,3,1,0,2,1,9,16,4,8,2,2,0)]);

  p = mp('Yoan','Makoundou','2009-08-10','PG',194,84,'INSEP','AAU','U18','FRA',s(7,6,7,8,8,6,4,4,8,8,6,7),86,'Lottery',2029,198);
  add(p,[mg(p.id,'2026-12-01','Team Europe','AAU',32,22,3,0,9,3,0,2,1,8,16,4,8,2,2,0),mg(p.id,'2027-01-10','Team France','AAU',32,26,4,1,8,2,0,3,2,10,17,3,7,3,4,0),mg(p.id,'2026-07-20','Team World','AAU',32,20,3,0,7,2,0,2,1,8,15,2,5,2,3,0)],[mn(p.id,'2027-01-10','French PG with elite speed and passing. Explosive in transition.','strength')]);

  p = mp('Caleb','Holt','2009-02-28','SG',193,82,'Lake Highland Prep','High School','U18','USA',s(8,8,7,7,5,5,4,4,8,6,5,7),83,'First Round',2029,198);
  add(p,[mg(p.id,'2026-11-18','Montverde','High School',32,26,4,1,3,2,0,2,1,10,18,4,9,2,2,0),mg(p.id,'2026-12-10','IMG Academy','High School',32,24,3,0,4,1,0,3,2,9,16,4,8,2,2,0),mg(p.id,'2027-01-12','Oak Hill','High School',32,28,5,1,3,2,0,2,1,10,17,5,10,3,3,0)],[mn(p.id,'2027-01-12','Lights-out shooter with quick release. Can score at all three levels.','strength')]);

  p = mp('Jalen','Reeves','2009-10-15','SG',196,86,'Don Bosco Prep','High School','U18','USA',s(7,7,7,7,6,6,4,5,8,7,6,7),84,'First Round',2029,200);
  add(p,[mg(p.id,'2026-12-05','St. Benedict\'s','High School',32,24,5,1,5,2,0,2,1,9,16,3,7,3,4,0),mg(p.id,'2027-01-18','Patrick School','High School',32,22,6,2,4,1,1,1,1,8,15,3,7,3,3,0),mg(p.id,'2026-07-16','PSA Cardinals','AAU',32,20,4,1,4,2,0,2,2,8,14,2,5,2,3,0)]);

  p = mp('Marcus','Watts','2009-07-02','SF',201,88,'Montverde Academy','High School','U18','USA',s(7,7,7,6,5,6,5,6,8,6,5,7),81,'First Round',2029,206);
  add(p,[mg(p.id,'2026-12-08','IMG Academy','High School',32,20,7,2,3,1,1,2,2,8,14,2,5,2,3,0),mg(p.id,'2027-01-15','Link Academy','High School',32,22,8,3,4,2,2,1,1,8,15,3,7,3,3,0)]);

  // ======== 2030 DRAFT CLASS (20+ players — HS Sophomores) ========

  p = mp('Isaiah','Brooks','2010-01-15','PG',188,78,'Prolific Prep','High School','U16','USA',s(6,5,6,8,7,6,3,3,8,7,6,7),82,'TBD',2030,192);
  add(p,[mg(p.id,'2026-11-20','Montverde','High School',28,14,2,0,6,2,0,3,1,5,12,1,4,3,4,0),mg(p.id,'2026-12-10','Sunrise Christian','High School',28,18,3,1,5,3,0,2,2,7,14,1,3,3,4,0),mg(p.id,'2026-07-10','Team Thad','AAU',28,16,2,0,7,2,0,3,1,6,13,1,4,3,4,0)],[mn(p.id,'2026-12-10','Already shows advanced pick-and-roll mastery for a sophomore.','strength')]);

  p = mp('Darius','Mitchell','2010-04-22','SF',199,85,'Oak Hill Academy','High School','U16','USA',s(6,6,7,6,5,6,5,6,9,6,5,7),83,'TBD',2030,206);
  add(p,[mg(p.id,'2026-12-01','Sierra Canyon','High School',26,16,7,2,2,1,2,2,2,6,12,1,3,3,4,0),mg(p.id,'2027-01-12','Compass Prep','High School',28,20,8,3,3,2,1,1,1,8,14,2,5,2,3,0),mg(p.id,'2026-07-14','Team CP3','AAU',26,18,7,2,2,1,1,2,2,7,13,2,4,2,3,0)],[mn(p.id,'2027-01-12','Freakish athletic tools. Still raw but the upside is scary.','strength')]);

  p = mp('Landon','Price','2010-06-30','SG',192,80,'IMG Academy','High School','U16','USA',s(7,7,6,7,5,5,3,3,7,6,5,7),80,'TBD',2030,196);
  add(p,[mg(p.id,'2026-11-18','Montverde','High School',26,18,3,0,3,1,0,2,1,7,14,3,7,1,1,0),mg(p.id,'2027-01-10','Link Academy','High School',28,22,4,1,2,2,0,2,2,8,15,4,8,2,2,0)]);

  p = mp('Anthony','Wallace','2010-09-05','PF',204,92,'Montverde Academy','High School','U16','USA',s(5,4,7,5,4,5,7,8,8,6,5,7),82,'TBD',2030,212);
  add(p,[mg(p.id,'2026-12-08','IMG Academy','High School',24,14,10,4,1,0,3,2,3,6,10,0,0,2,3,0),mg(p.id,'2027-01-15','Oak Hill','High School',26,16,12,5,2,1,4,1,2,7,11,0,0,2,3,0),mg(p.id,'2026-07-18','E1T1','AAU',24,16,11,4,1,0,3,2,3,7,11,0,0,2,3,0)]);

  p = mp('Justin','Harris','2010-03-12','PG',185,74,'Sierra Canyon','High School','U16','USA',s(6,6,5,8,7,6,3,3,7,7,6,7),79,'TBD',2030,190);
  add(p,[mg(p.id,'2026-12-01','Mater Dei','High School',24,12,2,0,6,2,0,3,1,5,11,1,3,1,2,0),mg(p.id,'2027-01-08','Corona Centennial','High School',26,16,3,0,7,3,0,2,2,6,12,2,5,2,2,0)]);

  p = mp('Kevin','Scott','2010-07-20','C',206,95,'Compass Prep','High School','U16','USA',s(4,3,7,4,4,4,7,8,7,6,5,7),78,'TBD',2030,214);
  add(p,[mg(p.id,'2026-11-22','Link Academy','High School',22,10,8,3,1,0,3,2,3,4,7,0,0,2,4,0),mg(p.id,'2027-01-14','IMG Academy','High School',24,12,10,4,1,1,4,1,2,5,8,0,0,2,3,0)]);

  p = mp('Brandon','Jackson','2010-11-08','SG',194,82,'Mater Dei','High School','U16','USA',s(7,6,6,6,5,5,4,4,7,6,5,7),78,'TBD',2030,198);
  add(p,[mg(p.id,'2026-12-08','Sierra Canyon','High School',24,16,3,0,3,1,0,2,1,6,12,2,5,2,3,0),mg(p.id,'2027-01-20','Chatsworth','High School',26,20,4,1,2,2,0,1,2,8,14,2,6,2,2,0)]);

  p = mp('Nathan','Cooper','2010-02-14','SF',198,84,'Link Academy','High School','U16','USA',s(6,5,7,6,5,6,5,6,8,6,5,7),79,'TBD',2030,204);
  add(p,[mg(p.id,'2026-11-20','Sunrise Christian','High School',24,14,6,2,2,1,1,2,2,6,12,1,3,1,2,0),mg(p.id,'2027-01-08','Montverde','High School',26,16,7,2,3,1,2,1,1,7,13,1,3,1,2,0)]);

  p = mp('Andre','Hill','2010-05-18','PG',186,74,'Overtime Elite','High School','U16','USA',s(6,5,6,8,7,6,3,3,8,7,6,7),80,'TBD',2030,192);
  add(p,[mg(p.id,'2026-11-22','Pro16','High School',24,14,2,0,7,3,0,3,1,5,11,2,5,2,3,0),mg(p.id,'2027-01-10','City Reapers','High School',26,16,3,1,6,2,0,2,2,6,12,2,5,2,3,0)]);

  p = mp('Jaylen','Foster','2010-08-02','PF',202,90,'Sunrise Christian','High School','U16','USA',s(5,4,7,5,5,5,7,7,8,6,5,7),78,'TBD',2030,210);
  add(p,[mg(p.id,'2026-12-01','Link Academy','High School',24,12,8,3,2,0,3,2,3,5,9,0,0,2,4,0),mg(p.id,'2027-01-12','IMG Academy','High School',26,14,10,4,1,1,2,1,2,6,10,0,0,2,3,0)]);

  p = mp('Marcus','Reed','2010-10-25','SG',193,80,'Brewster Academy','High School','U16','USA',s(7,7,5,6,5,5,3,3,7,6,5,6),77,'TBD',2030,196);
  add(p,[mg(p.id,'2026-11-18','IMG Academy','High School',22,14,3,0,2,1,0,2,1,5,11,2,5,2,3,0),mg(p.id,'2027-01-08','Oak Hill','High School',24,16,4,1,3,2,0,3,2,6,12,2,5,2,3,0)]);

  p = mp('Derek','Lewis','2010-12-15','C',205,94,'La Lumiere','High School','U16','USA',s(4,3,7,4,4,4,7,8,7,6,5,7),77,'TBD',2030,212);
  add(p,[mg(p.id,'2026-12-08','Montverde','High School',20,10,8,3,1,0,3,2,3,4,7,0,0,2,4,0),mg(p.id,'2027-01-14','IMG Academy','High School',22,12,10,4,1,1,3,1,2,5,8,0,0,2,3,0)]);

  p = mp('Bryson','Tiller','2010-04-08','PG',189,78,'Compass Prep','High School','U16','USA',s(7,6,6,8,7,6,3,3,8,7,6,7),82,'TBD',2030,194);
  add(p,[mg(p.id,'2026-11-20','IMG Academy','High School',24,16,2,0,7,3,0,2,1,6,12,2,5,2,3,0),mg(p.id,'2027-01-10','Montverde','High School',26,20,3,0,6,2,0,3,2,8,14,2,5,2,3,0),mg(p.id,'2026-07-14','AZ Unity','AAU',24,18,2,0,8,3,0,2,1,7,13,2,5,2,3,0)],[mn(p.id,'2027-01-10','Floor general with great court vision for a sophomore. Controls the pace.','strength')]);

  p = mp('Xavier','Green','2010-01-28','SF',200,86,'Oak Hill Academy','High School','U16','USA',s(6,5,7,6,5,6,5,7,9,6,5,7),83,'TBD',2030,208);
  add(p,[mg(p.id,'2026-12-01','Sierra Canyon','High School',24,16,8,3,2,1,2,2,2,6,12,1,3,3,4,0),mg(p.id,'2027-01-14','Montverde','High School',26,20,9,3,3,2,1,1,1,8,14,2,5,2,3,0),mg(p.id,'2026-07-18','Team CP3','AAU',24,18,7,2,2,1,2,2,2,7,13,2,4,2,3,0)],[mn(p.id,'2027-01-14','Freakish athleticism for a sophomore. One of the most explosive players in his class.','strength')]);

  p = mp('Trey','Robinson','2010-08-15','SG',195,82,'Montverde Academy','High School','U16','USA',s(7,7,6,7,5,5,4,4,7,6,5,7),80,'TBD',2030,198);
  add(p,[mg(p.id,'2026-12-08','IMG Academy','High School',24,20,3,0,3,1,0,2,1,8,14,3,7,1,1,0),mg(p.id,'2027-01-15','Oak Hill','High School',26,22,4,1,2,2,0,2,2,8,15,4,8,2,2,0)]);

  p = mp('Cameron','Brooks','2010-06-22','PF',206,94,'IMG Academy','High School','U16','USA',s(5,4,7,5,4,5,8,8,8,6,5,7),81,'TBD',2030,214);
  add(p,[mg(p.id,'2026-11-18','Montverde','High School',22,12,10,4,1,0,4,2,3,5,8,0,0,2,4,0),mg(p.id,'2027-01-08','Link Academy','High School',24,16,12,5,2,1,3,1,2,7,11,0,0,2,3,0),mg(p.id,'2026-07-20','E1T1','AAU',22,14,11,4,1,0,4,2,3,6,10,0,0,2,3,0)],[mn(p.id,'2027-01-08','Great motor and rim protection. One of the best shot-blockers in 2030 class.','strength')]);

  p = mp('Elijah','Washington','2010-03-05','PG',186,74,'Sierra Canyon','High School','U16','USA',s(6,6,5,8,7,6,3,3,7,7,6,7),79,'TBD',2030,190);
  add(p,[mg(p.id,'2026-12-01','Mater Dei','High School',22,14,2,0,6,2,0,3,1,5,11,2,5,1,2,0),mg(p.id,'2027-01-12','Corona Centennial','High School',24,16,3,1,7,3,0,2,2,6,12,2,5,2,2,0)]);

  p = mp('Dante','Harris','2010-09-12','SF',197,82,'Sunrise Christian','High School','U16','USA',s(6,5,7,6,5,6,5,6,8,6,5,7),79,'TBD',2030,204);
  add(p,[mg(p.id,'2026-11-22','Link Academy','High School',22,14,6,2,2,1,1,2,2,6,12,1,3,1,2,0),mg(p.id,'2027-01-10','Compass Prep','High School',24,16,7,2,3,1,2,1,1,7,13,1,3,1,2,0)]);

  p = mp('Jaden','Clark','2010-11-20','C',204,92,'Findlay Prep','High School','U16','USA',s(4,3,7,4,4,4,7,8,7,6,5,7),78,'TBD',2030,212);
  add(p,[mg(p.id,'2026-12-05','Bishop Gorman','High School',20,10,8,3,1,0,3,2,3,4,7,0,0,2,4,0),mg(p.id,'2027-01-14','Coronado','High School',22,12,10,4,1,1,4,1,2,5,8,0,0,2,3,0)]);

  p = mp('Amari','Grant','2010-02-10','SF',201,88,'Utah Prep','High School','U16','USA',s(7,7,8,7,5,6,5,6,9,7,6,8),87,'TBD',2030,208);
  add(p,[mg(p.id,'2026-11-18','Montverde','High School',26,24,7,2,3,2,1,1,1,9,16,3,7,3,3,0),mg(p.id,'2026-12-10','IMG Academy','High School',28,28,8,3,4,1,2,2,2,10,17,4,8,3,4,0),mg(p.id,'2027-01-08','Link Academy','High School',28,26,6,2,5,2,1,1,1,10,17,3,7,3,3,0),mg(p.id,'2026-07-14','Utah Prospects','AAU',26,22,7,2,3,1,1,2,2,8,14,3,6,3,4,0)],[mn(p.id,'2027-01-08','Top prospect in 2030 class. Elite scorer with NBA body already. Versatile wing.','strength')]);

  p = mp('Tyrese','Proctor Jr','2010-05-18','PG',190,78,'Compass Prep','High School','U16','USA',s(6,6,6,8,7,6,3,3,8,7,6,7),81,'TBD',2030,194);
  add(p,[mg(p.id,'2026-12-01','IMG Academy','High School',24,16,2,0,7,3,0,2,1,6,12,2,5,2,3,0),mg(p.id,'2027-01-10','Montverde','High School',26,18,3,1,6,2,0,3,2,7,14,2,5,2,3,0)]);

  // ======== INTERNATIONAL PROSPECTS ========

  p = mp('Hugo','Gonzalez','2008-03-18','PG',192,82,'Real Madrid U18','Euroleague','U18','ESP',s(7,7,6,8,8,6,4,4,7,7,7,8),86,'Lottery',2028,196);
  add(p,[mg(p.id,'2026-11-20','Barcelona U18','Euroleague',32,18,3,0,9,3,0,2,1,7,14,2,5,2,3,0),mg(p.id,'2026-12-10','Partizan U18','Euroleague',32,22,4,1,7,2,0,3,2,8,16,4,8,2,2,0),mg(p.id,'2027-01-14','Olympiacos U18','Euroleague',32,20,3,0,8,2,0,2,1,8,15,2,5,2,3,0)],[mn(p.id,'2027-01-14','Best international PG in 2028 class. Crafty playmaker with Euro league experience.','strength')]);

  p = mp('Stefan','Miljenovic','2008-07-10','SF',201,90,'Mega Basket U19','Euroleague','U18','SRB',s(7,7,7,6,5,6,5,6,8,7,5,7),84,'Lottery',2028,206);
  add(p,[mg(p.id,'2026-11-18','Partizan U19','Euroleague',32,22,6,2,3,1,1,2,2,8,15,3,7,3,3,0),mg(p.id,'2026-12-08','Crvena Zvezda U19','Euroleague',32,20,7,2,4,2,2,1,1,8,14,2,5,2,3,0),mg(p.id,'2027-01-12','Buducnost U19','Euroleague',32,24,8,3,3,1,1,2,2,9,16,3,7,3,3,0)],[mn(p.id,'2027-01-12','Serbian wing with smooth offensive game. Great size and skill combo.','strength')]);

  p = mp('Mathis','Music','2008-11-25','C',213,105,'ASVEL U19','Euroleague','U18','FRA',s(5,4,8,4,5,5,9,9,8,7,5,8),88,'Lottery',2028,220);
  add(p,[mg(p.id,'2026-11-22','Paris Basketball U19','Euroleague',30,14,12,5,3,1,6,2,3,6,10,0,0,2,4,0),mg(p.id,'2026-12-10','Monaco U19','Euroleague',32,18,14,5,2,0,5,1,2,8,12,0,0,2,3,0),mg(p.id,'2027-01-08','Cholet U19','Euroleague',30,16,10,4,4,1,7,2,4,7,10,0,0,2,4,0)],[mn(p.id,'2027-01-08','French 7-footer. Elite rim protector with passing ability rare for his size.','strength')]);

  p = mp('Lorenzo','Cremonesi','2009-02-14','PG',194,82,'Olimpia Milano U19','Euroleague','U18','ITA',s(7,7,6,7,7,5,3,3,7,7,6,7),82,'First Round',2029,198);
  add(p,[mg(p.id,'2026-12-01','Virtus Bologna U19','Euroleague',32,18,3,0,7,2,0,3,1,7,14,2,5,2,3,0),mg(p.id,'2027-01-10','Vanoli Cremona U19','Euroleague',32,22,4,1,8,3,0,2,2,8,16,4,8,2,2,0),mg(p.id,'2027-01-22','Reyer Venezia U19','Euroleague',32,20,3,0,6,2,0,2,1,8,15,2,5,2,3,0)],[mn(p.id,'2027-01-10','Italian PG with excellent feel for the game. Composed and skilled beyond his years.','strength')]);

  p = mp('Axel','Bongolo','2009-06-20','SF',203,92,'Paris Basketball U18','Euroleague','U18','FRA',s(6,6,7,6,5,7,5,6,9,6,5,7),83,'First Round',2029,208);
  add(p,[mg(p.id,'2026-11-20','ASVEL U18','Euroleague',32,18,7,2,3,1,2,2,2,7,14,2,5,2,3,0),mg(p.id,'2027-01-12','Monaco U18','Euroleague',32,22,8,3,2,2,1,1,1,8,15,3,7,3,3,0),mg(p.id,'2026-07-14','Team France U18','AAU',32,20,9,3,3,1,1,2,2,8,14,2,5,2,3,0)],[mn(p.id,'2027-01-12','French wing with exceptional length and defensive versatility. Improving shooter.','general')]);

  p = mp('Efe','Odigie','2009-09-15','C',210,100,'AEK Athens U19','Euroleague','U18','NGR',s(5,3,8,4,4,5,8,9,9,6,5,8),85,'Lottery',2029,218);
  add(p,[mg(p.id,'2026-12-05','Olympiacos U19','Euroleague',28,16,12,5,1,0,5,2,3,7,10,0,0,2,4,0),mg(p.id,'2027-01-14','Panathinaikos U19','Euroleague',30,20,14,6,2,1,6,1,2,9,13,0,0,2,3,0),mg(p.id,'2026-07-18','Team Africa','AAU',28,18,10,4,2,0,4,2,3,8,12,0,0,2,3,0)],[mn(p.id,'2027-01-14','Nigerian center developing in Greece. Absurd athleticism and shot-blocking instincts.','strength')]);

  p = mp('Izan','Almansa','2010-01-08','PF',204,92,'Barcelona U16','Euroleague','U16','ESP',s(6,5,7,5,5,6,7,7,8,7,5,7),82,'TBD',2030,212);
  add(p,[mg(p.id,'2026-11-18','Real Madrid U16','Euroleague',24,14,10,4,2,1,3,2,3,6,10,0,1,2,3,0),mg(p.id,'2026-12-10','Valencia U16','Euroleague',26,16,12,5,1,0,4,1,2,7,11,0,0,2,3,0),mg(p.id,'2027-01-12','Joventut U16','Euroleague',24,18,8,3,3,1,3,2,3,8,12,0,1,2,3,0)],[mn(p.id,'2027-01-12','Spanish big man with high IQ and skill. Excellent passer for his size.','strength')]);

  p = mp('Viktor','Lakic','2010-04-22','PG',189,78,'Mega Basket U16','Euroleague','U16','SRB',s(6,6,6,8,7,5,3,3,7,7,6,7),80,'TBD',2030,194);
  add(p,[mg(p.id,'2026-12-01','Partizan U16','Euroleague',22,14,2,0,7,2,0,3,1,5,11,2,5,1,2,0),mg(p.id,'2027-01-10','Crvena Zvezda U16','Euroleague',24,16,3,0,6,3,0,2,2,6,12,2,5,2,2,0)]);

  p = mp('Luka','Tarlac','2010-08-10','PF',206,94,'Cibona U16','Euroleague','U16','CRO',s(6,5,7,5,5,5,7,7,8,7,5,7),81,'TBD',2030,212);
  add(p,[mg(p.id,'2026-11-22','Cedevita U16','Euroleague',22,12,8,3,2,1,3,2,3,5,9,0,0,2,3,0),mg(p.id,'2027-01-08','Split U16','Euroleague',24,14,10,4,1,0,2,1,2,6,10,0,1,2,3,0)],[mn(p.id,'2027-01-08','Croatian PF. Skilled face-up game and strong rebounding instincts.','general')]);

  return { players, gameLogs, notes };
}
