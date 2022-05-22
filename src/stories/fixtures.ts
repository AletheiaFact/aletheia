const classifications = [
    "true",
    "true-but",
    "arguable",
    "misleading",
    "false",
    "unsustainable",
    "exaggerated",
    "not-fact",
    "unverifiable",
];

const getStats = (count: number) => {
    const stats = []

    if(count <=0){
        return stats
    }

    for (let i = 0; i < count; i++) {
       stats.push( {
            _id: classifications[i],
            percentage: 100/count,
            count: 1,
        })
    }
    return stats
}


const claim = {
        "content": {
            "object": [
                {
                    "type": "paragraph",
                    "props": {
                        "id": 1
                    },
                    "content": [
                        {
                            "type": "sentence",
                            "props": {
                                "id": 1,
                                "data-hash": "18fee621a631d5576d503c319a35b42a"
                            },
                            "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                        },
                        {
                            "type": "sentence",
                            "props": {
                                "id": 2,
                                "data-hash": "92bae8ec20aa0fc21d1c33a79b00e6a5"
                            },
                            "content": "Nullam malesuada viverra sagittis."
                        },
                    ]
                },
                {
                    "type": "paragraph",
                    "props": {
                        "id": 2
                    },
                    "content": [
                        {
                            "type": "sentence",
                            "props": {
                                "id": 15,
                                "data-hash": "86b485a74f89c6aaff463f166171cdb2"
                            },
                            "content": "Duis euismod, mi vel euismod sodales, tellus felis malesuada sem, id posuere tortor elit in tellus."
                        },
                        {
                            "type": "sentence",
                            "props": {
                                "id": 16,
                                "data-hash": "d631234a9773fcbc33173c601d74cc3a"
                            },
                            "content": "Vivamus luctus vestibulum lacinia."
                        },
                    ]
                }
            ],
            "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Nullam malesuada viverra sagittis.Maecenas scelerisque massa quis ultricies rhoncus.Vestibulum ac lobortis odio.Integer accumsan convallis pulvinar.Vivamus sed turpis vel orci egestas pharetra.Sed interdum orci nisl, euismod pharetra est interdum ut. Phasellus non metus aliquam, placerat turpis ultrices, fermentum libero.In quis sollicitudin diam.Integer fermentum lobortis convallis.Nunc sit amet est bibendum, vestibulum orci eu, tristique magna.Integer viverra enim vitae lacus gravida venenatis.Aliquam a nisi cursus, vehicula erat eu, accumsan metus.Vestibulum nisl libero, consectetur nec ullamcorper quis, fringilla eget enim.Mauris eget maximus elit, eget vehicula lorem.Duis euismod, mi vel euismod sodales, tellus felis malesuada sem, id posuere tortor elit in tellus.Vivamus luctus vestibulum lacinia.Vestibulum bibendum condimentum sapien, id ultricies nulla lobortis ac.Quisque eget tortor venenatis, aliquam mi in, commodo nunc.Praesent porta lobortis neque, sed ullamcorper ligula rutrum varius.Vivamus lobortis mauris sit amet tortor fermentum volutpat.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.Nulla bibendum odio lorem, sed vulputate turpis tempus ut. Morbi vehicula enim et scelerisque pulvinar.Ut eget lacus scelerisque, consequat dui eget, facilisis nibh."
        },
        "title": "Lipsum",
        date: "2022-04-10T13:05:49.334Z"
}

const personality = {
    name: "Personality name",
    description: "Personality description",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/245px-President_Barack_Obama.jpg",
    slug: "personality-name",
    stats: {
        total: 1,
        reviews: [
            {
                _id: "true",
                percentage: 100,
                count: 1,
            },
        ],
    },
    claims: [
        claim
    ]
};


export {classifications, getStats, personality, claim}
