export class Pagination implements OnChanges {
    @Input('users') _users: any;
    private perPage: number = 0;
    users: any[];
    pgFrom: number = 1;
    pgTo: number = 0;
    pgJumpIndex: number = 0;
    pgAllowForward: boolean = false;
    pgAllowBackward: boolean = false;

    constructor() {
        this.perPage = 10; // configurable
        this.users = [];
    }

    initiate() {
        this.paginate();
    }

    pgSlice() {
        this.users = this._users.slice(this.pgFrom - 1, this.pgTo);
    }

    pgJump(e) {
        const charCode = (e.which) ? e.which : e.keyCode;
        if (charCode === 13) {
            const value = parseInt(e.target.value);
            const maxJump = Math.ceil(this._users.length / this.perPage);
            if (!isNaN(value) && value > 0 && value <= maxJump) {
                this.pgFrom = (this.perPage * (value - 1)) + 1;
                this.pgTo = (value * this.perPage) > this._users.length ? this._users.length : value * this.perPage;
                if (this.pgTo === this._users.length) {
                    this.pgAllowForward = false;
                } else {
                    this.pgAllowForward = true;
                }
                if (this.pgFrom === 1) {
                    this.pgAllowBackward = false;
                } else {
                    this.pgAllowBackward = true;
                }
                this.pgSlice();
                this.pgJumpIndex = value;
            }
        }
    }

    paginate() {
        if (this._users.length === 0) {
            this.pgFrom = this.pgTo = this.pgJumpIndex = 0;
            this.pgAllowBackward = this.pgAllowForward = false;
            this.users = [];
            return;
        } else if (this._users.length > this.perPage) {
            this.pgTo = this.perPage;
            this.pgAllowForward = true;
        } else {
            this.pgTo = this._users.length;
        }
        this.pgFrom = 1;
        this.pgJumpIndex = 1;
        this.pgAllowBackward = false;
        return this.pgSlice();
    }

    pgNext() {
        if (this.pgAllowForward) {
            this.pgFrom += this.perPage;
            this.pgAllowBackward = true;
            if ((this.pgTo + this.perPage) > this._users.length) {
                this.pgTo = this._users.length;
                this.pgAllowForward = false;
            } else {
                this.pgTo += this.perPage;
            }
            this.pgJumpIndex++;
            return this.pgSlice();
        }
    }

    pgPrevious() {
        if (this.pgAllowBackward) {
            this.pgAllowForward = true;
            if (this.pgTo % this.perPage === 0) {
                this.pgTo -= this.perPage;
            } else {
                this.pgTo -= this.pgTo % this.perPage;
            }
            if ((this.pgFrom - this.perPage) <= 1) {
                this.pgFrom = 1;
                this.pgAllowBackward = false;
            } else {
                this.pgFrom -= this.perPage;
            }
            this.pgJumpIndex--;
            return this.pgSlice();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['_users']) {
            this._users = changes['_users'].currentValue;
        }
        this.initiate();
    }
}
