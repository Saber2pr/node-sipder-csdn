import http from 'https'

export namespace Http {
  export function get(url: string): Promise<string> {
    return new Promise((resolve, reject) =>
      http
        .get(url, res => {
          let str = ''
          res.on('data', chunk => (str += chunk))
          res.on('end', () => resolve(str))
        })
        .on('error', err => reject(err))
    )
  }
}
