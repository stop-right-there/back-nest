import { IAresWeatherResponse } from '../type/aerisweather.type';

export const aerisMock: IAresWeatherResponse = {
  success: true,
  error: null,
  response: [
    {
      id: '2023-SH-18',
      profile: {
        basinOrigin: 'SH',
        basinCurrent: 'SH',
        basins: ['SH'],
        name: 'Eighteen',
        year: 2023,
        event: 18,
        productEvent: 5,
        isActive: true,
        lifespan: {
          startTimestamp: 1680976800,
          startDateTimeISO: '2023-04-09T02:00:00+08:00',
          endTimestamp: null,
          endDateTimeISO: null,
        },
        maxStormType: 'TS',
        maxStormCat: 'TS',
        maxStormName: 'Tropical Storm Eighteen',
        windSpeed: {
          maxKTS: 55,
          maxKPH: 102,
          maxMPH: 63,
          maxTimestamp: 1681192800,
          maxDateTimeISO: '2023-04-11T14:00:00+08:00',
        },
        pressure: {
          minMB: null,
          minIN: null,
          minTimestamp: null,
          minDateTimeISO: null,
        },
        boundingBox: [
          -25.362111083135, 118.68202772926, -11.3, 136.93059008127,
        ],
        tz: 'Asia/Makassar',
      },
      position: {
        location: {
          type: 'Point',
          coordinates: [121.8, -14.3],
        },
        details: {
          basin: 'SH',
          stormType: 'TS',
          stormCat: 'TS',
          stormName: 'Tropical Cyclone Eighteen',
          stormShortName: 'Eighteen',
          advisoryNumber: '11',
          movement: {
            directionDEG: 205,
            direction: 'SSW',
            speedKTS: 4,
            speedKPH: 7,
            speedMPH: 5,
          },
          windRadii: [
            {
              quadrants: {
                ne: {
                  loc: {
                    long: 122.77821122032,
                    lat: -13.350110003927,
                  },
                  distanceKM: 148.16,
                  distanceMI: 92,
                  distanceNM: 80,
                },
                se: {
                  loc: {
                    long: 122.90047514998,
                    lat: -15.363831404929,
                  },
                  distanceKM: 166.68,
                  distanceMI: 104,
                  distanceNM: 90,
                },
                sw: {
                  loc: {
                    long: 120.94405662285,
                    lat: -15.127884511068,
                  },
                  distanceKM: 129.64,
                  distanceMI: 81,
                  distanceNM: 70,
                },
                nw: {
                  loc: {
                    long: 121.00519185903,
                    lat: -13.528504746327,
                  },
                  distanceKM: 120.38,
                  distanceMI: 75,
                  distanceNM: 65,
                },
              },
              windField: null,
              windSpeedKTS: 34,
              windSpeedKPH: 63,
              windSpeedMPH: 39,
            },
            {
              quadrants: {
                ne: {
                  loc: {
                    long: 121.86114079945,
                    lat: -14.240745798317,
                  },
                  distanceKM: 9.26,
                  distanceMI: 6,
                  distanceNM: 5,
                },
                se: {
                  loc: {
                    long: 121.86114079945,
                    lat: -14.359238585817,
                  },
                  distanceKM: 9.26,
                  distanceMI: 6,
                  distanceNM: 5,
                },
                sw: {
                  loc: {
                    long: 121.37201782707,
                    lat: -14.714337916003,
                  },
                  distanceKM: 64.82,
                  distanceMI: 40,
                  distanceNM: 35,
                },
                nw: {
                  loc: {
                    long: 121.73885920055,
                    lat: -14.240745798317,
                  },
                  distanceKM: 9.26,
                  distanceMI: 6,
                  distanceNM: 5,
                },
              },
              windField: null,
              windSpeedKTS: 50,
              windSpeedKPH: 93,
              windSpeedMPH: 58,
            },
          ],
          windSpeedKTS: 55,
          windSpeedKPH: 102,
          windSpeedMPH: 63,
          gustSpeedKTS: 70,
          gustSpeedKPH: 130,
          gustSpeedMPH: 81,
          pressureMB: null,
          pressureIN: null,
        },
        timestamp: 1681192800,
        dateTimeISO: '2023-04-11T14:00:00+08:00',
        loc: {
          long: 121.8,
          lat: -14.3,
        },
      },
      track: [
        {
          location: {
            type: 'Point',
            coordinates: [128.2, -11.3],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '1',
            movement: {
              directionDEG: 210,
              direction: 'SSW',
              speedKTS: 9,
              speedKPH: 17,
              speedMPH: 10,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 129.04601048785,
                      lat: -10.469193964383,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                  se: {
                    loc: {
                      long: 128.74387459232,
                      lat: -11.832834129255,
                    },
                    distanceKM: 83.34,
                    distanceMI: 52,
                    distanceNM: 45,
                  },
                  sw: {
                    loc: {
                      long: 127.41441520142,
                      lat: -12.069317257839,
                    },
                    distanceKM: 120.38,
                    distanceMI: 75,
                    distanceNM: 65,
                  },
                  nw: {
                    loc: {
                      long: 127.71655451107,
                      lat: -10.825535203864,
                    },
                    distanceKM: 74.08,
                    distanceMI: 46,
                    distanceNM: 40,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
            ],
            windSpeedKTS: 35,
            windSpeedKPH: 65,
            windSpeedMPH: 40,
            gustSpeedKTS: 45,
            gustSpeedKPH: 83,
            gustSpeedMPH: 52,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1680976800,
          dateTimeISO: '2023-04-09T02:00:00+08:00',
          loc: {
            long: 128.2,
            lat: -11.3,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [127.2, -11.9],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '2',
            movement: {
              directionDEG: 240,
              direction: 'WSW',
              speedKTS: 11,
              speedKPH: 20,
              speedMPH: 13,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 127.98724280223,
                      lat: -11.128588526031,
                    },
                    distanceKM: 120.38,
                    distanceMI: 75,
                    distanceNM: 65,
                  },
                  se: {
                    loc: {
                      long: 128.22945030697,
                      lat: -12.905450577274,
                    },
                    distanceKM: 157.42,
                    distanceMI: 98,
                    distanceNM: 85,
                  },
                  sw: {
                    loc: {
                      long: 126.35220395939,
                      lat: -12.728305057252,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                  nw: {
                    loc: {
                      long: 126.41275719777,
                      lat: -11.128588526031,
                    },
                    distanceKM: 120.38,
                    distanceMI: 75,
                    distanceNM: 65,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
            ],
            windSpeedKTS: 40,
            windSpeedKPH: 74,
            windSpeedMPH: 46,
            gustSpeedKTS: 50,
            gustSpeedKPH: 93,
            gustSpeedMPH: 58,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1680998400,
          dateTimeISO: '2023-04-09T08:00:00+08:00',
          loc: {
            long: 127.2,
            lat: -11.9,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [126.1, -12.3],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '3',
            movement: {
              directionDEG: 250,
              direction: 'WSW',
              speedKTS: 11,
              speedKPH: 20,
              speedMPH: 13,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 126.70646813711,
                      lat: -11.706786865872,
                    },
                    distanceKM: 92.6,
                    distanceMI: 58,
                    distanceNM: 50,
                  },
                  se: {
                    loc: {
                      long: 127.07032331352,
                      lat: -13.246331272594,
                    },
                    distanceKM: 148.16,
                    distanceMI: 92,
                    distanceNM: 80,
                  },
                  sw: {
                    loc: {
                      long: 125.372243673,
                      lat: -13.010085487173,
                    },
                    distanceKM: 111.12,
                    distanceMI: 69,
                    distanceNM: 60,
                  },
                  nw: {
                    loc: {
                      long: 125.91805674756,
                      lat: -12.122173076252,
                    },
                    distanceKM: 27.78,
                    distanceMI: 17,
                    distanceNM: 15,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
            ],
            windSpeedKTS: 45,
            windSpeedKPH: 83,
            windSpeedMPH: 52,
            gustSpeedKTS: 55,
            gustSpeedKPH: 102,
            gustSpeedMPH: 63,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681020000,
          dateTimeISO: '2023-04-09T14:00:00+08:00',
          loc: {
            long: 126.1,
            lat: -12.3,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [125.1, -12.8],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '4',
            movement: {
              directionDEG: 245,
              direction: 'WSW',
              speedKTS: 11,
              speedKPH: 20,
              speedMPH: 13,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 125.88990314392,
                      lat: -12.028554705325,
                    },
                    distanceKM: 120.38,
                    distanceMI: 75,
                    distanceNM: 65,
                  },
                  se: {
                    loc: {
                      long: 125.95066104081,
                      lat: -13.628151041742,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                  sw: {
                    loc: {
                      long: 124.24933895919,
                      lat: -13.628151041742,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                  nw: {
                    loc: {
                      long: 124.4316149924,
                      lat: -12.147385342415,
                    },
                    distanceKM: 101.86,
                    distanceMI: 63,
                    distanceNM: 55,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
            ],
            windSpeedKTS: 45,
            windSpeedKPH: 83,
            windSpeedMPH: 52,
            gustSpeedKTS: 55,
            gustSpeedKPH: 102,
            gustSpeedMPH: 63,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681041600,
          dateTimeISO: '2023-04-09T20:00:00+08:00',
          loc: {
            long: 125.1,
            lat: -12.8,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [124.2, -13.3],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '5',
            movement: {
              directionDEG: 240,
              direction: 'WSW',
              speedKTS: 10,
              speedKPH: 19,
              speedMPH: 12,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 124.99147211111,
                      lat: -12.528537178021,
                    },
                    distanceKM: 120.38,
                    distanceMI: 75,
                    distanceNM: 65,
                  },
                  se: {
                    loc: {
                      long: 125.35672954838,
                      lat: -14.423073496329,
                    },
                    distanceKM: 175.94,
                    distanceMI: 109,
                    distanceNM: 95,
                  },
                  sw: {
                    loc: {
                      long: 123.10414412884,
                      lat: -14.364103029036,
                    },
                    distanceKM: 166.68,
                    distanceMI: 104,
                    distanceNM: 90,
                  },
                  nw: {
                    loc: {
                      long: 123.53028741885,
                      lat: -12.647376629118,
                    },
                    distanceKM: 101.86,
                    distanceMI: 63,
                    distanceNM: 55,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
            ],
            windSpeedKTS: 45,
            windSpeedKPH: 83,
            windSpeedMPH: 52,
            gustSpeedKTS: 55,
            gustSpeedKPH: 102,
            gustSpeedMPH: 63,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681063200,
          dateTimeISO: '2023-04-10T02:00:00+08:00',
          loc: {
            long: 124.2,
            lat: -13.3,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [123.4, -13.6],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '6',
            movement: {
              directionDEG: 250,
              direction: 'WSW',
              speedKTS: 8,
              speedKPH: 15,
              speedMPH: 9,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 124.25339847993,
                      lat: -12.769083909765,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                  se: {
                    loc: {
                      long: 124.68004507944,
                      lat: -14.840861583109,
                    },
                    distanceKM: 194.46,
                    distanceMI: 121,
                    distanceNM: 105,
                  },
                  sw: {
                    loc: {
                      long: 122.11995492056,
                      lat: -14.840861583109,
                    },
                    distanceKM: 194.46,
                    distanceMI: 121,
                    distanceNM: 105,
                  },
                  nw: {
                    loc: {
                      long: 122.54660152007,
                      lat: -12.769083909765,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 123.4,
                      lat: -13.6,
                    },
                    distanceKM: 0,
                    distanceMI: 0,
                    distanceNM: 0,
                  },
                  se: {
                    loc: {
                      long: 123.76575202621,
                      lat: -13.955229352911,
                    },
                    distanceKM: 55.56,
                    distanceMI: 35,
                    distanceNM: 30,
                  },
                  sw: {
                    loc: {
                      long: 123.09520608223,
                      lat: -13.89606220304,
                    },
                    distanceKM: 46.3,
                    distanceMI: 29,
                    distanceNM: 25,
                  },
                  nw: {
                    loc: {
                      long: 123.4,
                      lat: -13.6,
                    },
                    distanceKM: 0,
                    distanceMI: 0,
                    distanceNM: 0,
                  },
                },
                windSpeedKTS: 50,
                windSpeedKPH: 93,
                windSpeedMPH: 58,
              },
            ],
            windSpeedKTS: 50,
            windSpeedKPH: 93,
            windSpeedMPH: 58,
            gustSpeedKTS: 65,
            gustSpeedKPH: 120,
            gustSpeedMPH: 75,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681084800,
          dateTimeISO: '2023-04-10T08:00:00+08:00',
          loc: {
            long: 123.4,
            lat: -13.6,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [122.9, -13.1],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '7',
            movement: {
              directionDEG: 245,
              direction: 'WSW',
              speedKTS: 7,
              speedKPH: 13,
              speedMPH: 8,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 123.69083666407,
                      lat: -12.328544082374,
                    },
                    distanceKM: 120.38,
                    distanceMI: 75,
                    distanceNM: 65,
                  },
                  se: {
                    loc: {
                      long: 124.11662439622,
                      lat: -14.282092015483,
                    },
                    distanceKM: 185.2,
                    distanceMI: 115,
                    distanceNM: 100,
                  },
                  sw: {
                    loc: {
                      long: 121.80502400879,
                      lat: -14.164156465212,
                    },
                    distanceKM: 166.68,
                    distanceMI: 104,
                    distanceNM: 90,
                  },
                  nw: {
                    loc: {
                      long: 122.10916333593,
                      lat: -12.328544082374,
                    },
                    distanceKM: 120.38,
                    distanceMI: 75,
                    distanceNM: 65,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
            ],
            windSpeedKTS: 45,
            windSpeedKPH: 83,
            windSpeedMPH: 52,
            gustSpeedKTS: 55,
            gustSpeedKPH: 102,
            gustSpeedMPH: 63,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681106400,
          dateTimeISO: '2023-04-10T14:00:00+08:00',
          loc: {
            long: 122.9,
            lat: -13.1,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [122.5, -13.4],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '8',
            movement: {
              directionDEG: 240,
              direction: 'WSW',
              speedKTS: 6,
              speedKPH: 11,
              speedMPH: 7,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 123.16998475987,
                      lat: -12.747374978793,
                    },
                    distanceKM: 101.86,
                    distanceMI: 63,
                    distanceNM: 55,
                  },
                  se: {
                    loc: {
                      long: 123.4745011655,
                      lat: -14.346092650512,
                    },
                    distanceKM: 148.16,
                    distanceMI: 92,
                    distanceNM: 80,
                  },
                  sw: {
                    loc: {
                      long: 121.5254988345,
                      lat: -14.346092650512,
                    },
                    distanceKM: 148.16,
                    distanceMI: 92,
                    distanceNM: 80,
                  },
                  nw: {
                    loc: {
                      long: 121.58640039486,
                      lat: -12.509638007017,
                    },
                    distanceKM: 138.9,
                    distanceMI: 86,
                    distanceNM: 75,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
            ],
            windSpeedKTS: 45,
            windSpeedKPH: 83,
            windSpeedMPH: 52,
            gustSpeedKTS: 55,
            gustSpeedKPH: 102,
            gustSpeedMPH: 63,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681128000,
          dateTimeISO: '2023-04-10T20:00:00+08:00',
          loc: {
            long: 122.5,
            lat: -13.4,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [122.1, -13.7],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '9',
            movement: {
              directionDEG: 235,
              direction: 'SW',
              speedKTS: 7,
              speedKPH: 13,
              speedMPH: 8,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 122.77081470428,
                      lat: -13.047370210541,
                    },
                    distanceKM: 101.86,
                    distanceMI: 63,
                    distanceNM: 55,
                  },
                  se: {
                    loc: {
                      long: 123.01473137377,
                      lat: -14.587017447174,
                    },
                    distanceKM: 138.9,
                    distanceMI: 86,
                    distanceNM: 75,
                  },
                  sw: {
                    loc: {
                      long: 121.12429160628,
                      lat: -14.646026226082,
                    },
                    distanceKM: 148.16,
                    distanceMI: 92,
                    distanceNM: 80,
                  },
                  nw: {
                    loc: {
                      long: 121.24624656654,
                      lat: -12.86907958111,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 122.1,
                      lat: -13.7,
                    },
                    distanceKM: 0,
                    distanceMI: 0,
                    distanceNM: 0,
                  },
                  se: {
                    loc: {
                      long: 122.1,
                      lat: -13.7,
                    },
                    distanceKM: 0,
                    distanceMI: 0,
                    distanceNM: 0,
                  },
                  sw: {
                    loc: {
                      long: 121.67311276267,
                      lat: -14.114375117386,
                    },
                    distanceKM: 64.82,
                    distanceMI: 40,
                    distanceNM: 35,
                  },
                  nw: {
                    loc: {
                      long: 122.1,
                      lat: -13.7,
                    },
                    distanceKM: 0,
                    distanceMI: 0,
                    distanceNM: 0,
                  },
                },
                windSpeedKTS: 50,
                windSpeedKPH: 93,
                windSpeedMPH: 58,
              },
            ],
            windSpeedKTS: 50,
            windSpeedKPH: 93,
            windSpeedMPH: 58,
            gustSpeedKTS: 65,
            gustSpeedKPH: 120,
            gustSpeedMPH: 75,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681149600,
          dateTimeISO: '2023-04-11T02:00:00+08:00',
          loc: {
            long: 122.1,
            lat: -13.7,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [121.4, -14],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '10',
            movement: {
              directionDEG: 245,
              direction: 'WSW',
              speedKTS: 7,
              speedKPH: 13,
              speedMPH: 8,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 122.07166485724,
                      lat: -13.347365714071,
                    },
                    distanceKM: 101.86,
                    distanceMI: 63,
                    distanceNM: 55,
                  },
                  se: {
                    loc: {
                      long: 122.31589070033,
                      lat: -14.886957221182,
                    },
                    distanceKM: 138.9,
                    distanceMI: 86,
                    distanceNM: 75,
                  },
                  sw: {
                    loc: {
                      long: 120.42305498268,
                      lat: -14.94595922444,
                    },
                    distanceKM: 148.16,
                    distanceMI: 92,
                    distanceNM: 80,
                  },
                  nw: {
                    loc: {
                      long: 120.54516453546,
                      lat: -13.169066815122,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 121.46106166632,
                      lat: -13.940744491027,
                    },
                    distanceKM: 9.26,
                    distanceMI: 6,
                    distanceNM: 5,
                  },
                  se: {
                    loc: {
                      long: 121.46106166632,
                      lat: -14.059240233509,
                    },
                    distanceKM: 9.26,
                    distanceMI: 6,
                    distanceNM: 5,
                  },
                  sw: {
                    loc: {
                      long: 120.97257176498,
                      lat: -14.414356628177,
                    },
                    distanceKM: 64.82,
                    distanceMI: 40,
                    distanceNM: 35,
                  },
                  nw: {
                    loc: {
                      long: 121.33893833368,
                      lat: -13.940744491027,
                    },
                    distanceKM: 9.26,
                    distanceMI: 6,
                    distanceNM: 5,
                  },
                },
                windSpeedKTS: 50,
                windSpeedKPH: 93,
                windSpeedMPH: 58,
              },
            ],
            windSpeedKTS: 50,
            windSpeedKPH: 93,
            windSpeedMPH: 58,
            gustSpeedKTS: 65,
            gustSpeedKPH: 120,
            gustSpeedMPH: 75,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681171200,
          dateTimeISO: '2023-04-11T08:00:00+08:00',
          loc: {
            long: 121.4,
            lat: -14,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [121.8, -14.3],
          },
          details: {
            basin: 'SH',
            stormType: 'TS',
            stormCat: 'TS',
            stormName: 'Tropical Cyclone Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: '11',
            movement: {
              directionDEG: 205,
              direction: 'SSW',
              speedKTS: 4,
              speedKPH: 7,
              speedMPH: 5,
            },
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 122.77821122032,
                      lat: -13.350110003927,
                    },
                    distanceKM: 148.16,
                    distanceMI: 92,
                    distanceNM: 80,
                  },
                  se: {
                    loc: {
                      long: 122.90047514998,
                      lat: -15.363831404929,
                    },
                    distanceKM: 166.68,
                    distanceMI: 104,
                    distanceNM: 90,
                  },
                  sw: {
                    loc: {
                      long: 120.94405662285,
                      lat: -15.127884511068,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                  nw: {
                    loc: {
                      long: 121.00519185903,
                      lat: -13.528504746327,
                    },
                    distanceKM: 120.38,
                    distanceMI: 75,
                    distanceNM: 65,
                  },
                },
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 121.86114079945,
                      lat: -14.240745798317,
                    },
                    distanceKM: 9.26,
                    distanceMI: 6,
                    distanceNM: 5,
                  },
                  se: {
                    loc: {
                      long: 121.86114079945,
                      lat: -14.359238585817,
                    },
                    distanceKM: 9.26,
                    distanceMI: 6,
                    distanceNM: 5,
                  },
                  sw: {
                    loc: {
                      long: 121.37201782707,
                      lat: -14.714337916003,
                    },
                    distanceKM: 64.82,
                    distanceMI: 40,
                    distanceNM: 35,
                  },
                  nw: {
                    loc: {
                      long: 121.73885920055,
                      lat: -14.240745798317,
                    },
                    distanceKM: 9.26,
                    distanceMI: 6,
                    distanceNM: 5,
                  },
                },
                windSpeedKTS: 50,
                windSpeedKPH: 93,
                windSpeedMPH: 58,
              },
            ],
            windSpeedKTS: 55,
            windSpeedKPH: 102,
            windSpeedMPH: 63,
            gustSpeedKTS: 70,
            gustSpeedKPH: 130,
            gustSpeedMPH: 81,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681192800,
          dateTimeISO: '2023-04-11T14:00:00+08:00',
          loc: {
            long: 121.8,
            lat: -14.3,
          },
        },
      ],
      forecast: [
        {
          location: {
            type: 'Point',
            coordinates: [121, -15.1],
          },
          details: {
            basin: 'SH',
            stormType: 'TY',
            stormCat: 'TY',
            stormName: 'Typhoon Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: 11,
            movement: null,
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 121.7363139961,
                      lat: -14.387924177844,
                    },
                    distanceKM: 111.12,
                    distanceMI: 69,
                    distanceNM: 60,
                  },
                  se: {
                    loc: {
                      long: 121.8590256143,
                      lat: -15.927737336298,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                  sw: {
                    loc: {
                      long: 120.3864005423,
                      lat: -15.691583958748,
                    },
                    distanceKM: 92.6,
                    distanceMI: 58,
                    distanceNM: 50,
                  },
                  nw: {
                    loc: {
                      long: 120.50911751404,
                      lat: -14.62553905388,
                    },
                    distanceKM: 74.08,
                    distanceMI: 46,
                    distanceNM: 40,
                  },
                },
                windField: null,
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 121.12272183803,
                      lat: -14.981482392938,
                    },
                    distanceKM: 18.52,
                    distanceMI: 12,
                    distanceNM: 10,
                  },
                  se: {
                    loc: {
                      long: 121.12272183803,
                      lat: -15.218451495406,
                    },
                    distanceKM: 18.52,
                    distanceMI: 12,
                    distanceNM: 10,
                  },
                  sw: {
                    loc: {
                      long: 120.87727816197,
                      lat: -15.218451495406,
                    },
                    distanceKM: 18.52,
                    distanceMI: 12,
                    distanceNM: 10,
                  },
                  nw: {
                    loc: {
                      long: 120.75455681055,
                      lat: -14.862899290496,
                    },
                    distanceKM: 37.04,
                    distanceMI: 23,
                    distanceNM: 20,
                  },
                },
                windField: null,
                windSpeedKTS: 50,
                windSpeedKPH: 93,
                windSpeedMPH: 58,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 121,
                      lat: -15.1,
                    },
                    distanceKM: 0,
                    distanceMI: 0,
                    distanceNM: 0,
                  },
                  se: {
                    loc: {
                      long: 121,
                      lat: -15.1,
                    },
                    distanceKM: 0,
                    distanceMI: 0,
                    distanceNM: 0,
                  },
                  sw: {
                    loc: {
                      long: 120.93863905057,
                      lat: -15.159234050262,
                    },
                    distanceKM: 9.26,
                    distanceMI: 6,
                    distanceNM: 5,
                  },
                  nw: {
                    loc: {
                      long: 120.87727816197,
                      lat: -14.981482392938,
                    },
                    distanceKM: 18.52,
                    distanceMI: 12,
                    distanceNM: 10,
                  },
                },
                windField: null,
                windSpeedKTS: 64,
                windSpeedKPH: 119,
                windSpeedMPH: 74,
              },
            ],
            windSpeedKTS: 70,
            windSpeedKPH: 130,
            windSpeedMPH: 81,
            gustSpeedKTS: 85,
            gustSpeedKPH: 157,
            gustSpeedMPH: 98,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681236000,
          dateTimeISO: '2023-04-12T02:00:00+08:00',
          loc: {
            long: 121,
            lat: -15.1,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [120.3, -15.8],
          },
          details: {
            basin: 'SH',
            stormType: 'TY',
            stormCat: 'TY',
            stormName: 'Typhoon Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: 11,
            movement: null,
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 121.16187710678,
                      lat: -14.96899692613,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                  se: {
                    loc: {
                      long: 121.28499271939,
                      lat: -16.745545082085,
                    },
                    distanceKM: 148.16,
                    distanceMI: 92,
                    distanceNM: 80,
                  },
                  sw: {
                    loc: {
                      long: 119.56124189705,
                      lat: -16.509592525441,
                    },
                    distanceKM: 111.12,
                    distanceMI: 69,
                    distanceNM: 60,
                  },
                  nw: {
                    loc: {
                      long: 119.68436380743,
                      lat: -15.206760537209,
                    },
                    distanceKM: 92.6,
                    distanceMI: 58,
                    distanceNM: 50,
                  },
                },
                windField: null,
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 120.54625786748,
                      lat: -15.562907813804,
                    },
                    distanceKM: 37.04,
                    distanceMI: 23,
                    distanceNM: 20,
                  },
                  se: {
                    loc: {
                      long: 120.54625786748,
                      lat: -16.03681488339,
                    },
                    distanceKM: 37.04,
                    distanceMI: 23,
                    distanceNM: 20,
                  },
                  sw: {
                    loc: {
                      long: 119.93061440962,
                      lat: -16.155116761495,
                    },
                    distanceKM: 55.56,
                    distanceMI: 35,
                    distanceNM: 30,
                  },
                  nw: {
                    loc: {
                      long: 120.05374213252,
                      lat: -15.562907813804,
                    },
                    distanceKM: 37.04,
                    distanceMI: 23,
                    distanceNM: 20,
                  },
                },
                windField: null,
                windSpeedKTS: 50,
                windSpeedKPH: 93,
                windSpeedMPH: 58,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 120.3,
                      lat: -15.8,
                    },
                    distanceKM: 0,
                    distanceMI: 0,
                    distanceNM: 0,
                  },
                  se: {
                    loc: {
                      long: 120.3,
                      lat: -15.8,
                    },
                    distanceKM: 0,
                    distanceMI: 0,
                    distanceNM: 0,
                  },
                  sw: {
                    loc: {
                      long: 120.17687082409,
                      lat: -15.918442418977,
                    },
                    distanceKM: 18.52,
                    distanceMI: 12,
                    distanceNM: 10,
                  },
                  nw: {
                    loc: {
                      long: 120.17687082409,
                      lat: -15.681488255894,
                    },
                    distanceKM: 18.52,
                    distanceMI: 12,
                    distanceNM: 10,
                  },
                },
                windField: null,
                windSpeedKTS: 64,
                windSpeedKPH: 119,
                windSpeedMPH: 74,
              },
            ],
            windSpeedKTS: 85,
            windSpeedKPH: 157,
            windSpeedMPH: 98,
            gustSpeedKTS: 105,
            gustSpeedKPH: 194,
            gustSpeedMPH: 121,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681279200,
          dateTimeISO: '2023-04-12T14:00:00+08:00',
          loc: {
            long: 120.3,
            lat: -15.8,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [119.8, -16.7],
          },
          details: {
            basin: 'SH',
            stormType: 'TY',
            stormCat: 'TY',
            stormName: 'Typhoon Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: 11,
            movement: null,
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 120.91309587086,
                      lat: -15.630896966964,
                    },
                    distanceKM: 166.68,
                    distanceMI: 104,
                    distanceNM: 90,
                  },
                  se: {
                    loc: {
                      long: 120.91309587086,
                      lat: -17.763149179527,
                    },
                    distanceKM: 166.68,
                    distanceMI: 104,
                    distanceNM: 90,
                  },
                  sw: {
                    loc: {
                      long: 119.05791442911,
                      lat: -17.409456775201,
                    },
                    distanceKM: 111.12,
                    distanceMI: 69,
                    distanceNM: 60,
                  },
                  nw: {
                    loc: {
                      long: 119.05791442911,
                      lat: -15.987897398965,
                    },
                    distanceKM: 111.12,
                    distanceMI: 69,
                    distanceNM: 60,
                  },
                },
                windField: null,
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 120.29473013012,
                      lat: -16.225550368975,
                    },
                    distanceKM: 74.08,
                    distanceMI: 46,
                    distanceNM: 40,
                  },
                  se: {
                    loc: {
                      long: 120.29473013012,
                      lat: -17.173273773866,
                    },
                    distanceKM: 74.08,
                    distanceMI: 46,
                    distanceNM: 40,
                  },
                  sw: {
                    loc: {
                      long: 119.30526986988,
                      lat: -17.173273773866,
                    },
                    distanceKM: 74.08,
                    distanceMI: 46,
                    distanceNM: 40,
                  },
                  nw: {
                    loc: {
                      long: 119.42895071824,
                      lat: -16.344270768411,
                    },
                    distanceKM: 55.56,
                    distanceMI: 35,
                    distanceNM: 30,
                  },
                },
                windField: null,
                windSpeedKTS: 50,
                windSpeedKPH: 93,
                windSpeedMPH: 58,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 120.17104928176,
                      lat: -16.344270768411,
                    },
                    distanceKM: 55.56,
                    distanceMI: 35,
                    distanceNM: 30,
                  },
                  se: {
                    loc: {
                      long: 120.17104928176,
                      lat: -17.05506782482,
                    },
                    distanceKM: 55.56,
                    distanceMI: 35,
                    distanceNM: 30,
                  },
                  sw: {
                    loc: {
                      long: 119.55263301019,
                      lat: -16.936786446959,
                    },
                    distanceKM: 37.04,
                    distanceMI: 23,
                    distanceNM: 20,
                  },
                  nw: {
                    loc: {
                      long: 119.55263301019,
                      lat: -16.462919598566,
                    },
                    distanceKM: 37.04,
                    distanceMI: 23,
                    distanceNM: 20,
                  },
                },
                windField: null,
                windSpeedKTS: 64,
                windSpeedKPH: 119,
                windSpeedMPH: 74,
              },
            ],
            windSpeedKTS: 105,
            windSpeedKPH: 194,
            windSpeedMPH: 121,
            gustSpeedKTS: 130,
            gustSpeedKPH: 241,
            gustSpeedMPH: 150,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681322400,
          dateTimeISO: '2023-04-13T02:00:00+08:00',
          loc: {
            long: 119.8,
            lat: -16.7,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [119.9, -17.9],
          },
          details: {
            basin: 'SH',
            stormType: 'TY',
            stormCat: 'TY',
            stormName: 'Typhoon Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: 11,
            movement: null,
            windRadii: [
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 121.1447049619,
                      lat: -16.711624971801,
                    },
                    distanceKM: 185.2,
                    distanceMI: 115,
                    distanceNM: 100,
                  },
                  se: {
                    loc: {
                      long: 120.89578684943,
                      lat: -18.845035600755,
                    },
                    distanceKM: 148.16,
                    distanceMI: 92,
                    distanceNM: 80,
                  },
                  sw: {
                    loc: {
                      long: 119.15314651776,
                      lat: -18.609270096928,
                    },
                    distanceKM: 111.12,
                    distanceMI: 69,
                    distanceNM: 60,
                  },
                  nw: {
                    loc: {
                      long: 119.02867816584,
                      lat: -17.068928951745,
                    },
                    distanceKM: 129.64,
                    distanceMI: 81,
                    distanceNM: 70,
                  },
                },
                windField: null,
                windSpeedKTS: 34,
                windSpeedKPH: 63,
                windSpeedMPH: 39,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 120.39790867581,
                      lat: -17.425562339301,
                    },
                    distanceKM: 74.08,
                    distanceMI: 46,
                    distanceNM: 40,
                  },
                  se: {
                    loc: {
                      long: 120.39790867581,
                      lat: -18.373172051221,
                    },
                    distanceKM: 74.08,
                    distanceMI: 46,
                    distanceNM: 40,
                  },
                  sw: {
                    loc: {
                      long: 119.40209132419,
                      lat: -18.373172051221,
                    },
                    distanceKM: 74.08,
                    distanceMI: 46,
                    distanceNM: 40,
                  },
                  nw: {
                    loc: {
                      long: 119.52656682521,
                      lat: -17.544288085745,
                    },
                    distanceKM: 55.56,
                    distanceMI: 35,
                    distanceNM: 30,
                  },
                },
                windField: null,
                windSpeedKTS: 50,
                windSpeedKPH: 93,
                windSpeedMPH: 58,
              },
              {
                quadrants: {
                  ne: {
                    loc: {
                      long: 120.27343317479,
                      lat: -17.544288085745,
                    },
                    distanceKM: 55.56,
                    distanceMI: 35,
                    distanceNM: 30,
                  },
                  se: {
                    loc: {
                      long: 120.27343317479,
                      lat: -18.255000023014,
                    },
                    distanceKM: 55.56,
                    distanceMI: 35,
                    distanceNM: 30,
                  },
                  sw: {
                    loc: {
                      long: 119.6510437559,
                      lat: -18.136746891186,
                    },
                    distanceKM: 37.04,
                    distanceMI: 23,
                    distanceNM: 20,
                  },
                  nw: {
                    loc: {
                      long: 119.6510437559,
                      lat: -17.66293671718,
                    },
                    distanceKM: 37.04,
                    distanceMI: 23,
                    distanceNM: 20,
                  },
                },
                windField: null,
                windSpeedKTS: 64,
                windSpeedKPH: 119,
                windSpeedMPH: 74,
              },
            ],
            windSpeedKTS: 120,
            windSpeedKPH: 222,
            windSpeedMPH: 138,
            gustSpeedKTS: 145,
            gustSpeedKPH: 269,
            gustSpeedMPH: 167,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681365600,
          dateTimeISO: '2023-04-13T14:00:00+08:00',
          loc: {
            long: 119.9,
            lat: -17.9,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [124.3, -20.9],
          },
          details: {
            basin: 'SH',
            stormType: 'TY',
            stormCat: 'TY',
            stormName: 'Typhoon Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: 11,
            movement: null,
            windRadii: null,
            windSpeedKTS: 70,
            windSpeedKPH: 130,
            windSpeedMPH: 81,
            gustSpeedKTS: 85,
            gustSpeedKPH: 157,
            gustSpeedMPH: 98,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681452000,
          dateTimeISO: '2023-04-14T14:00:00+08:00',
          loc: {
            long: 124.3,
            lat: -20.9,
          },
        },
        {
          location: {
            type: 'Point',
            coordinates: [134.9, -23.5],
          },
          details: {
            basin: 'SH',
            stormType: 'TD',
            stormCat: 'TD',
            stormName: 'Tropical Depression Eighteen',
            stormShortName: 'Eighteen',
            advisoryNumber: 11,
            movement: null,
            windRadii: null,
            windSpeedKTS: 30,
            windSpeedKPH: 56,
            windSpeedMPH: 35,
            gustSpeedKTS: 40,
            gustSpeedKPH: 74,
            gustSpeedMPH: 46,
            pressureMB: null,
            pressureIN: null,
          },
          timestamp: 1681538400,
          dateTimeISO: '2023-04-15T14:00:00+08:00',
          loc: {
            long: 134.9,
            lat: -23.5,
          },
        },
      ],
      breakPointAlerts: null,
      errorCone: null,
    },
  ],
};
