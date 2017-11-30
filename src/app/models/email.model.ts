export class EmailModel {
    constructor(public Subject: string,
                public From: string,
                public Body: string,
                public Id: string,
                public Unread: boolean,
                public Timestamp: string,
                public To?: string,
                public Date?:string,
     ) {
    }
}
