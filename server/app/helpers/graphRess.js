const genName = require('./name')

exports.generate = function (array) {
    const ress = {}
    let cache = ''
    for (const v of array) {
        if (cache === '') {
            cache =
            v.time.getFullYear() +
            '-' +
            (v.time.getMonth() + 1) +
            '-' +
            v.time.getDate() +
            ' ' +
            v.time.getHours()
        }

        if (
            cache !=
            v.time.getFullYear() +
            '-' +
            (v.time.getMonth() + 1) +
            '-' +
            v.time.getDate() +
            ' ' +
            v.time.getHours()
        ) {
            while (
            cache !=
            v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ) {
            let t = new Date(cache + ':00:00').getTime()
            // Add one hours to date
            t += 60 * 60 * 1000
            cache = new Date(t)
            ress[
                cache.getFullYear() +
                '-' +
                (cache.getMonth() + 1) +
                '-' +
                cache.getDate() +
                ' ' +
                cache.getHours()
            ] =
                ress[
                v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] + 1 || 1

            cache =
                cache.getFullYear() +
                '-' +
                (cache.getMonth() + 1) +
                '-' +
                cache.getDate() +
                ' ' +
                cache.getHours()
            }
        }
        if (
            cache ==
            v.time.getFullYear() +
            '-' +
            (v.time.getMonth() + 1) +
            '-' +
            v.time.getDate() +
            ' ' +
            v.time.getHours()
        ) {
            ress[
            v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ] =
            ress[
                v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ] + 1 || 1
        }
    }
    return ress
    }

    exports.generateWithName = function (array) {
    const ress = {}
    let cache = ''
    for (const v of array) {
        if (cache === '') {
            cache =
            v.time.getFullYear() +
            '-' +
            (v.time.getMonth() + 1) +
            '-' +
            v.time.getDate() +
            ' ' +
            v.time.getHours()
        }

        if (
            cache !=
            v.time.getFullYear() +
            '-' +
            (v.time.getMonth() + 1) +
            '-' +
            v.time.getDate() +
            ' ' +
            v.time.getHours()
        ) {
            while (
            cache !=
            v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ) {
            let t = new Date(cache + ':00:00').getTime()
            // Add one hours to date
            t += 60 * 60 * 1000
            cache = new Date(t)
            ress[
                cache.getFullYear() +
                '-' +
                (cache.getMonth() + 1) +
                '-' +
                cache.getDate() +
                ' ' +
                cache.getHours()
            ] =
                ress[
                v.time.getFullYear() +
                    '-' +
                    (v.time.getMonth() + 1) +
                    '-' +
                    v.time.getDate() +
                    ' ' +
                    v.time.getHours()
                ] + 1 || 1

            cache =
                cache.getFullYear() +
                '-' +
                (cache.getMonth() + 1) +
                '-' +
                cache.getDate() +
                ' ' +
                cache.getHours()
            }
        }
        if (
            cache ==
            v.time.getFullYear() +
            '-' +
            (v.time.getMonth() + 1) +
            '-' +
            v.time.getDate() +
            ' ' +
            v.time.getHours()
        ) {
            ress[
            v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ] =
            ress[
                v.time.getFullYear() +
                '-' +
                (v.time.getMonth() + 1) +
                '-' +
                v.time.getDate() +
                ' ' +
                v.time.getHours()
            ] + 1 || 1
        }
        v['picture'] = `${genName.genName(v.time, v.track_id)}.jpg`
        v['movie'] = `${genName.genName(v.time, v.track_id)}_video.mp4`
    }
    return {
        ress: ress,
        array: array
    }
}
