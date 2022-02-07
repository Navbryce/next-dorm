import { concatMap, ReplaySubject } from "rxjs";
import SweetAlert from "sweetalert2/dist/sweetalert2.js";
import Swal from "sweetalert2";

export interface Alert {
  title: string;
  text: string;
}

export class AlertService {
  private alertSubject = new ReplaySubject<{
    alert: Alert;
    callback: () => void;
  }>();

  constructor() {
    this.alertSubject
      .asObservable()
      .pipe(
        concatMap(async ({ alert, callback }) => {
          await (SweetAlert as typeof Swal).fire({
            ...alert,
            icon: "error",
            confirmButtonText: "Ok",
            customClass: {
              popup: "dark:bg-slate-800 dark:text-blue-100",
            },
          });
          callback();
        })
      )
      .subscribe();
  }

  async alert(alert: Alert): Promise<void> {
    return new Promise((resolve, reject) => {
      this.alertSubject.next({
        alert,
        callback: resolve,
      });
    });
  }
}
