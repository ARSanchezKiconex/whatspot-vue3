class Booking {

  contructor(uuid) {
    this.uuid = uuid;
    this.user_uuid = "";
    this.room_uuid = "";
    this.start_date = "";
    this.end_date = "";
    this.start_time = "";
    this.end_time = "";
    this.title = "";
    this.details = "";
  }

  set(data) {
    this.user_uuid = data.user_uuid;
    this.room_uuid = data.room_uuid;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.title = data.title;
    this.details = data.details;
  }


}