import { WeatherData } from '../types';

export function decodeWmoCode(code: number): { text: string; icon: string } {
  switch (code) {
    case 0:
      return { text: 'Clear Sky', icon: 'Sun' };
    case 1:
      return { text: 'Mainly Clear', icon: 'Sun' };
    case 2:
      return { text: 'Partly Cloudy', icon: 'CloudSun' };
    case 3:
      return { text: 'Overcast', icon: 'Cloud' };
    case 45:
    case 48:
      return { text: 'Haze / Fog', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { text: 'Light Drizzle', icon: 'CloudDrizzle' };
    case 61:
    case 63:
    case 65:
      return { text: 'Rain', icon: 'CloudRain' };
    case 71:
    case 73:
    case 75:
      return { text: 'Snow', icon: 'CloudSnow' };
    case 80:
    case 81:
    case 82:
      return { text: 'Rain Showers', icon: 'CloudRain' };
    case 95:
    case 96:
    case 99:
      return { text: 'Thunderstorm', icon: 'CloudLightning' };
    default:
      return { text: 'Partly Cloudy', icon: 'CloudSun' };
  }
}

export function getWeatherSuggestions(temp: number, pop: number, code: number): string[] {
  const suggestions: string[] = [];

  const isRain = pop > 35 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
  const isHighHeat = temp >= 35;
  const isMildWarm = temp >= 28 && temp < 35;
  const isPleasant = temp >= 18 && temp < 28 && !isRain;

  if (isRain) {
    suggestions.push('Rain expected in Lahore: Postpone outdoor laundry or use indoor drying racks.');
    suggestions.push('Great window for indoor deep work: Focus on Power BI DAX modeling & portfolio refinement.');
    suggestions.push('Avoid non-essential outdoor errands during peak precipitation hours.');
  }

  if (isHighHeat) {
    suggestions.push('Extreme heat alert for Lahore: Schedule all errands before 11 AM or after 6 PM.');
    suggestions.push('Keep tuition room well-ventilated and hydrated with cool water for yourself and students.');
    suggestions.push('Avoid strenuous household tasks during afternoon peak heat (1:00 PM – 4:00 PM).');
  } else if (isMildWarm) {
    suggestions.push('Warm afternoon: Stay hydrated during 3–6 PM tuition classes.');
  }

  if (isPleasant) {
    suggestions.push('Pleasant Lahore weather: Ideal conditions for hanging laundry outside and morning market visits.');
    suggestions.push('Consider taking a 15-minute screen-free walk before your 10 PM AI class.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Standard weather conditions in Lahore. Follow your normal daily timetable.');
  }

  return suggestions;
}

export async function fetchLahoreWeather(latitude = 31.58, longitude = 74.33): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKarachi`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather service returned status ${res.status}`);
    }
    const data = await res.json();

    const current = data.current;
    const hourlyTimes: string[] = data.hourly?.time || [];
    const hourlyTemps: number[] = data.hourly?.temperature_2m || [];
    const hourlyCodes: number[] = data.hourly?.weather_code || [];
    const hourlyPops: number[] = data.hourly?.precipitation_probability || [];

    // Slice next 12 hours
    const currentHourIndex = hourlyTimes.findIndex((t: string) => {
      const hDate = new Date(t).getHours();
      const nDate = new Date().getHours();
      return hDate >= nDate;
    });

    const startIdx = Math.max(0, currentHourIndex);
    const hourlySlice = [];
    for (let i = startIdx; i < Math.min(startIdx + 12, hourlyTimes.length); i++) {
      hourlySlice.push({
        time: hourlyTimes[i],
        temp: Math.round(hourlyTemps[i]),
        code: hourlyCodes[i],
        pop: hourlyPops[i] ?? 0,
      });
    }

    const dailyDates: string[] = data.daily?.time || [];
    const dailyMaxTemps: number[] = data.daily?.temperature_2m_max || [];
    const dailyMinTemps: number[] = data.daily?.temperature_2m_min || [];
    const dailyCodes: number[] = data.daily?.weather_code || [];
    const dailyPopMaxs: number[] = data.daily?.precipitation_probability_max || [];

    const dailySlice = dailyDates.slice(0, 5).map((date, idx) => ({
      date,
      maxTemp: Math.round(dailyMaxTemps[idx]),
      minTemp: Math.round(dailyMinTemps[idx]),
      code: dailyCodes[idx],
      popMax: dailyPopMaxs[idx] ?? 0,
    }));

    const wmo = decodeWmoCode(current.weather_code);

    const nowKarachi = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());

    return {
      city: 'Lahore, Pakistan',
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      weatherCode: current.weather_code,
      weatherDescription: wmo.text,
      humidity: Math.round(current.relative_humidity_2m),
      precipitation: current.precipitation ?? 0,
      windSpeed: Math.round(current.wind_speed_10m),
      lastUpdated: nowKarachi,
      hourly: hourlySlice,
      daily: dailySlice,
      isLoading: false,
    };
  } catch (err: any) {
    return {
      city: 'Lahore, Pakistan',
      temperature: 28,
      apparentTemperature: 29,
      weatherCode: 1,
      weatherDescription: 'Mainly Clear (Cached/Offline)',
      humidity: 52,
      precipitation: 0,
      windSpeed: 11,
      lastUpdated: 'Live feed unavailable',
      hourly: [
        { time: '10:00', temp: 26, code: 1, pop: 5 },
        { time: '13:00', temp: 31, code: 2, pop: 10 },
        { time: '16:00', temp: 29, code: 1, pop: 5 },
        { time: '19:00', temp: 25, code: 0, pop: 0 },
        { time: '22:00', temp: 22, code: 0, pop: 0 },
      ],
      daily: [
        { date: 'Today', maxTemp: 31, minTemp: 19, code: 1, popMax: 10 },
        { date: 'Tomorrow', maxTemp: 30, minTemp: 18, code: 0, popMax: 5 },
      ],
      isLoading: false,
      error: err?.message || 'Unable to connect to weather service.',
    };
  }
}
