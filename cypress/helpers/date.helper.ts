export interface DateTimeOptions {
  addSeconds?: number;
  addMinutes?: number;
  addHours?: number;
  addDays?: number;
  addMonths?: number;
  addYears?: number;
}

export const getCurrentDateTime = ({
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addMonths,
  addYears,
}: DateTimeOptions = {}): string => {
  const now = new Date();
  if (addSeconds) now.setSeconds(now.getSeconds() + addSeconds);
  if (addMinutes) now.setMinutes(now.getMinutes() + addMinutes);
  if (addHours) now.setHours(now.getHours() + addHours);
  if (addDays) now.setDate(now.getDate() + addDays);
  if (addMonths) now.setMonth(now.getMonth() + addMonths);
  if (addYears) now.setFullYear(now.getFullYear() + addYears);
  const date = now.toLocaleDateString("pt-BR"); // "08/05/2025"
  const time = now.toLocaleTimeString("pt-BR", { hour12: false }); // "16:30:09"
  const [hh, mm, ss] = time.split(":");
  return `${date} ${mm}.${ss}.${hh}`;
};

export const getCurrentDate = ({
  addDays,
  addMonths,
  addYears,
}: DateTimeOptions = {}): string => {
  const now = new Date();
  if (addDays) now.setDate(now.getDate() + addDays);
  if (addMonths) now.setMonth(now.getMonth() + addMonths);
  if (addYears) now.setFullYear(now.getFullYear() + addYears);
  const date = now.toLocaleDateString("pt-BR"); // "08/05/2025"
  return `${date}`;
};

export const calcularTempoDecorrido = (dataInicio: string): string => {
    let inicio: Date;
    if (dataInicio.includes('/')) {
        const [dia, mes, ano] = dataInicio.split('/');
        inicio = new Date(Number(ano), Number(mes) - 1, Number(dia));
    } else {
        inicio = new Date(dataInicio);
    }
    
    const hoje = new Date();
    let totalMeses = (hoje.getFullYear() - inicio.getFullYear()) * 12
                   + (hoje.getMonth() - inicio.getMonth());

    if (hoje.getDate() < inicio.getDate()) {
        totalMeses--;
    }
    const anos = Math.floor(totalMeses / 12);
    const meses = totalMeses % 12;

    if (anos === 0) {
        return `${meses} mês(es)`;
    }
    if (meses === 0) {
        return `${anos} ano(s)`;
    }
    return `${anos} ano(s) ${meses} mês(es)`;
};