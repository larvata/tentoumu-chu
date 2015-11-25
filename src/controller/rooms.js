

export default function* list(next){
  if ('GET' !== this.method) return yield next;
  // this.body = yield render('')
}
