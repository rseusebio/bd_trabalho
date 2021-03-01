import { createConnection, ConnectionConfig, Connection } from "mysql";
import ICityOutcomeQtd from "./interfaces/ICityOutcomeQtd";
import ICityQtd from "./interfaces/ICityQtd";
import ICityResultMonthQtd from "./interfaces/ICityResultMonthQtd";
import ICityResultQtd from "./interfaces/ICityResultQtd";
import ICityYearResult from "./interfaces/ICityYearResult";
import { capitalize, randInteger } from "./utils";
import cacheManager from "./CacheManager";

const util = require("util");

class QueryManager 
{
    conn: Connection;

    constructor()
    {
        this.connect();        
    }
    
    connect()
    {
        const config: ConnectionConfig = 
        {
            host:     "", 
            user:     "", 
            password: "", 
            database: ""
        }

        this.conn = createConnection(config);  
        
        this.conn.connect();
    }

    async pacientsPerCity()
    {
        const key = `pacientes`;
        const cachedRes = cacheManager.getValue( key );

        if( cachedRes !== null )
        {
            return cachedRes;
        }

        const query = util.promisify(this.conn.query).bind(this.conn);

        const queryStr = 
        `
            SELECT municipio, count(*) as qtd 
            FROM Paciente 
            GROUP BY municipio;
        `;

        let res: Array<ICityQtd> = await query(queryStr);

        let result = res.map( v => {
            let municipio = v.municipio;

            if( v.municipio == null )
            {
                municipio = "Anonimo";
            }
        
            municipio = capitalize(municipio);

            return {
                id: municipio, 
                label: municipio, 
                value: v.qtd, 
                color: `hsl(${randInteger(10, 400)}, 70%, 50%)`
            }
        });

        cacheManager.setValue(key, result);

        return result;
    }

    async attendancePerCity()
    {
        const key = `atendimentos`;
        const cachedRes = cacheManager.getValue( key );

        if( cachedRes !== null )
        {
            return cachedRes;
        }

        const query = util.promisify(this.conn.query).bind(this.conn);

        const queryStr = 
        `
            SELECT municipio, count(*) as qtd
            FROM Paciente
            INNER JOIN Atendimento
            ON Paciente.id_paciente = Atendimento.id_paciente
            GROUP BY municipio;
        `;

        let res: Array<ICityQtd> = await query(queryStr);

        let result = res.map( v => {
            let municipio = v.municipio;

            if( v.municipio == null )
            {
                municipio = "Anonimo";
            }
        
            municipio = capitalize(municipio);

            return {
                id: municipio, 
                label: municipio, 
                value: v.qtd, 
                color: `hsl(${randInteger(10, 400)}, 70%, 50%)`
            }
        });

        cacheManager.setValue(key, result);

        return result;
    }

    async ratioAttendacePerPatient()
    {
        const key = `proporcao`;
        const cachedRes = cacheManager.getValue( key );

        if( cachedRes !== null )
        {
            return cachedRes;
        }

        const query = util.promisify(this.conn.query).bind(this.conn);

        const queryStr = 
        `
            select 
            t1.municipio,
            atendimentos / pacientes as qtd
            from
            ( 
                select municipio, count(*) as atendimentos
                from Paciente
                inner join Atendimento
                on Paciente.id_paciente = Atendimento.id_paciente
                group by municipio
                order by atendimentos
            ) as t1 
            inner join 
            (
                select municipio, count(*) as pacientes 
                from Paciente group by municipio
            ) as t2 
            on t2.municipio = t1.municipio
            order by municipio;
        `;

        let res: Array<ICityQtd> = await query(queryStr);

        let result = res.map( v => {
            let municipio = v.municipio;

            if( v.municipio == null )
            {
                municipio = "Anonimo";
            }
        
            municipio = capitalize(municipio);

            return {
                city: municipio, 
                ratio: v.qtd.toFixed(2)
            }
        });

        cacheManager.setValue(key, result);

        return result;
    }

    async outcomePerCity() 
    {
        const key = `desfechos`;
        const cachedRes = cacheManager.getValue( key );

        if( cachedRes !== null )
        {
            return cachedRes;
        }

        const query = util.promisify(this.conn.query).bind(this.conn);

        const queryStr = 
        `
            select 
                Paciente.municipio,
                Atendimento.desfecho, 
                count( * ) as qtd
            from 
                Paciente 
            inner join 
                Atendimento
            on 
                Paciente.id_paciente = Atendimento.id_paciente
            where 
                -- Paciente.municipio is not null and 
                Atendimento.desfecho is not null 
            group by 
                Paciente.municipio,  
                Atendimento.desfecho
            order by 
                Paciente.municipio;
        `;

        let map = {};

        let res: Array<ICityOutcomeQtd> = await query(queryStr);

        res.forEach( 
            v => 
            {
                let municipio = v.municipio;

                if( v.municipio == null )
                {
                    municipio = "Anonimo";

                    // return;
                }
            
                municipio = capitalize(municipio);

                if( !(municipio in map) )
                {
                    map[municipio] = 
                    {
                        municipio,
                        // alta: 0, 
                        obito: 0, 
                        transferencia: 0,
                        desistencia: 0,
                        assistencia_domiciliar: 0
                    }
                }

                const { desfecho, qtd } = v;

                if( desfecho.indexOf("obito") >= 0)
                {
                    map[municipio].obito += qtd;
                }
                else if( desfecho.indexOf("transferencia") >= 0)
                {
                    map[municipio].transferencia += qtd;
                }
                else if( desfecho.indexOf("desistencia") >= 0)
                {
                    map[municipio].desistencia += qtd;
                }
                else if( desfecho.indexOf("assistencia") >= 0)
                {
                    map[municipio].assistencia_domiciliar += qtd;
                }
                // else if( desfecho.indexOf("alta") >= 0)
                // {
                //     map[municipio].alta += qtd;
                // }
            }
        );
        
        let result = [];

        for( let prop in map )
        {   
            result.push(map[prop]);
        }

        cacheManager.setValue(key, result);
        
        return result;
    }

    async curedOutcomePerCity() 
    {
        const key = `desfechoscurados`;
        const cachedRes = cacheManager.getValue( key );

        if( cachedRes !== null )
        {
            return cachedRes;
        }

        const query = util.promisify(this.conn.query).bind(this.conn);

        const queryStr = 
        `
            select 
                Paciente.municipio,
                Atendimento.desfecho, 
                count( * ) as qtd
            from 
                Paciente 
            inner join 
                Atendimento
            on 
                Paciente.id_paciente = Atendimento.id_paciente
            where 
                Atendimento.desfecho is not null and 
                Atendimento.desfecho like "%alta%" 
            group by 
                Paciente.municipio,  
                Atendimento.desfecho
            order by 
                Paciente.municipio;
        `;

        let map = {};

        let res: Array<ICityOutcomeQtd> = await query(queryStr);

        res.forEach( 
            v => 
            {
                let municipio = v.municipio;

                if( v.municipio == null )
                {
                    municipio = "Anonimo";
                }
            
                municipio = capitalize(municipio);

                if( !(municipio in map) )
                {
                    map[municipio] = 
                    {
                        municipio,
                        alta: 0
                    }
                }

                const { desfecho, qtd } = v;

                if( desfecho.indexOf("alta") >= 0)
                {
                    map[municipio].alta += qtd;
                }
            }
        );
        
        let result = [];

        for(let prop in map)
        {   
            result.push(map[prop]);
        }

        cacheManager.setValue(key, result);
        
        return result;
    }

    async covPositivePerMonth(cidade: string) 
    {
        
        const key = `pacientescovid_${cidade}`;
        const cachedRes = cacheManager.getValue( key );

        if( cachedRes !== null )
        {
            return cachedRes;
        }

        const query = util.promisify(this.conn.query).bind(this.conn);

        let restriction = `Paciente.municipio like "%${cidade}%"`;
        if( cidade == "anonimo" )
        {
            restriction = "Paciente.municipio is null";
        }

        const queryStr = 
        `
        select 
            table1.municipio, 
            table2.de_resultado, 
            table2.mes,
            count(*) as qtd
        from
            (
                select 
                    Paciente.municipio as municipio, 
                    Atendimento.id_atendimento as id_atendimento
                from 
                    Paciente 
                inner join 
                    Atendimento
                on 
                    Paciente.id_paciente = Atendimento.id_paciente
                where
                    ${restriction}
            ) as table1
        inner join 
            (
                select
                    id_atendimento,  
                    de_resultado,
                    substring(dt_coleta, 4, 2) as mes
                from 
                    Exame
                where 
                    de_exame like "%cov%"
                    and de_resultado like "%detec%"
            ) as table2
        on 
            table1.id_atendimento = table2.id_atendimento
        group by 
            municipio, 
            mes, 
            de_resultado 
        order by 
            municipio, 
            de_resultado;
        `;

        let map = {};

        let res: Array<ICityResultMonthQtd> = await query(queryStr);

        res.forEach( 
            v => 
            {
                let municipio = v.municipio;

                if( v.municipio == null )
                {
                    municipio = "Anonimo";
                }
            
                municipio = capitalize(municipio);

                if( !(municipio in map) )
                {
                    map[municipio] = 
                    {
                        id: municipio,
                        color: `hsl(${randInteger(20, 400)}, 70%, 50%)`,
                        data: {}
                    }

                    for(let i = 3.; i <=12; i++)
                    {
                        let m = i.toString();

                        if( m.length < 2 )
                        {
                            m  = "0" + m;
                        }

                        map[municipio].data[m] = 
                        {
                            x: m, 
                            y: 0
                        }
                    }
                }

                const { de_resultado, mes, qtd } = v;

                if( !(mes in map[municipio].data) )
                {
                    map[municipio].data[mes] = 
                    {
                        x: mes, 
                        y: 0
                    }
                }

                if( de_resultado.indexOf("indetectavel") >= 0 || 
                    de_resultado.indexOf("nao detectado") >= 0 || 
                    de_resultado.indexOf("ausencia de anticorpos contra sars-cov-2") >= 0 
                )
                {
                    // do nothing
                }
                else 
                {
                    map[municipio].data[mes].y += qtd;
                }
            }
        );
        
        let result = [];
        let cities = [];

        for(let prop in map)
        {   
            cities.push(prop);

            let data = [];

            for( let m in map[prop].data )
            {
                data.push(map[prop].data[m])
            }

            data.sort( 
                (a,b) => {
                    a = parseInt(a.x);
                    b = parseInt(b.x);

                    if( a > b )
                    {
                        return 1
                    }
                    else if( a < b )
                    {
                        return -1 
                    }
                    return 0;
                }
            )

            map[prop].data = data;

            result.push(map[prop]);
        }

        cacheManager.setValue(key, result);
        
        return result;
    }

    async covPositive() 
    {
        const key = `covidcasos`;
        const cachedRes = cacheManager.getValue( key );

        if( cachedRes !== null )
        {
            return cachedRes;
        }

        const query = util.promisify(this.conn.query).bind(this.conn);

        const queryStr = 
        `
        select 
            table1.municipio, 
            table2.de_resultado, 
            count(*) as qtd
        from
        (
            select 
            Paciente.municipio as municipio, 
            Atendimento.id_atendimento as id_atendimento
            from Paciente 
            inner join Atendimento
            on Paciente.id_paciente = Atendimento.id_paciente
        ) as table1
        inner join 
        (
            select
            id_atendimento,  
            de_resultado
            from Exame
            where de_exame like "%cov%"
            and de_resultado like "%detec%"
        ) as table2
        on table1.id_atendimento = table2.id_atendimento
        group by de_resultado, municipio
        order by municipio, de_resultado;
        `;

        let map = {};

        let res: Array<ICityResultQtd> = await query(queryStr);

        res.forEach( 
            v => 
            {
                let municipio = v.municipio;

                if( v.municipio == null )
                {
                    municipio = "Anonimo";

                    return;
                }
            
                municipio = capitalize(municipio);

                if( !(municipio in map) )
                {
                    map[municipio] = 
                    {
                        municipio,
                        covid: 0
                    }
                }

                const { de_resultado, qtd } = v;

                if( de_resultado.indexOf("indetectavel") >= 0 || 
                    de_resultado.indexOf("nao detectado") >= 0 || 
                    de_resultado.indexOf("ausencia de anticorpos contra sars-cov-2") >= 0 
                )
                {
                    // do nothing
                }
                else 
                {
                    map[municipio].covid += qtd;
                }
            }
        );
        
        let result = [];

        for(let prop in map)
        {  
            result.push(map[prop]);
        }

        cacheManager.setValue(key, result);
        
        return result;
    }

    async deathsPerMonth(cidade: string) 
    {
        const key = `mortespormes_${cidade}`;
        const cachedRes = cacheManager.getValue( key );

        if( cachedRes !== null )
        {
            return cachedRes;
        }

        const query = util.promisify(this.conn.query).bind(this.conn);

        let restriction = `and Paciente.municipio like "%${cidade}%"`;
        if( cidade == "anonimo" )
        {
            restriction = "and Paciente.municipio is null";
        }

        const queryStr = 
        `
            select
                table1.municipio, 
                table1.mes,
                count(*) as qtd
            from 
            (
                select 
                    Paciente.municipio,
                    Atendimento.id_atendimento, 
                    Atendimento.desfecho,
                    substring(Atendimento.dt_atendimento, 4, 2) as mes
                from Paciente 
                inner join Atendimento 
                on Paciente.id_paciente = Atendimento.id_paciente
                where desfecho like "%obito%"
                ${restriction}
            ) as table1
            inner join 
            (
                select 
                    id_atendimento,
                    de_resultado
                from Exame 
                where de_exame like "%cov%"
                and de_resultado like "%detec%"
            ) as table2 
            on table1.id_atendimento = table2.id_atendimento
            group by municipio, mes
            order by municipio, mes;
        `;

        let res: Array<ICityResultMonthQtd> = await query(queryStr);

        let map = {
            id: cidade,
            color: `hsl(${randInteger(20, 400)}, 70%, 50%)`,
        }

        let data = [];

        let setted = new Set();

        res.forEach(
            v => 
            {
                const { mes, qtd } = v;

                let d = 
                {
                    x: mes, 
                    y: qtd
                }

                data.push(d);

                setted.add(mes);
            }
        );

        for(let i = 3; i <= 12; i++)
        {
            let m = i.toString();
            if( m.length < 2)
            {
                m = "0" + m;
            }
            if(!setted.has(m))
            {
                data.push(
                    {
                        x:m, 
                        y:0
                    }
                )
            }
        }

        data.sort( 
            (a,b) => {
                a = parseInt(a.x);
                b = parseInt(b.x);

                if( a > b )
                {
                    return 1
                }
                else if( a < b )
                {
                    return -1 
                }
                return 0;
            }
        );

        map["data"] = data;

        cacheManager.setValue(key, [map]);

        return [map];
    }

    async covPositivePerAge(cidade: string) 
    {
        const key = `covidporidade_${cidade}`;
        const cachedRes = cacheManager.getValue( key );

        if( cachedRes !== null )
        {
            return cachedRes;
        }

        const query = util.promisify(this.conn.query).bind(this.conn);

        let restriction = `Paciente.municipio like "%${cidade}%"`;

        if(cidade === "anonimo")
        {
            restriction = "Paciente.municipio is null"
        }

        const queryStr = 
        `
            select 
                t1.municipio,
                t1.ano_nascimento,
                t2.de_resultado,
                count(*) as qtd
            from
                (
                    select 
                        Paciente.id_paciente,
                        substring(Paciente.ano_nascimento,1, 3) as ano_nascimento,
                        Paciente.municipio, 
                        Atendimento.id_atendimento
                    from 
                        Paciente
                    inner join
                        Atendimento
                    on 
                        Paciente.id_paciente = Atendimento.id_paciente
                    where
                        ${restriction}
                ) as t1 
                inner join 
                (
                    select 
                        id_atendimento,
                        de_resultado
                    from 
                        Exame 
                    where 
                        de_exame like "%cov%" and 
                        de_resultado like "%detec%" 
                ) as t2 
            on 
                t1.id_atendimento = t2.id_atendimento
            group by 
                municipio,
                ano_nascimento, 
                de_resultado
            order by
                municipio,
                ano_nascimento,
                de_resultado;
        `;

        let map = {};

        let res: Array<ICityYearResult> = await query(queryStr);

        res.forEach( 
            v => 
            {
                let { ano_nascimento, de_resultado, qtd } = v;

                if( !ano_nascimento )
                {
                    return;
                }

                if( !(ano_nascimento in map) )
                {
                    map[ano_nascimento] = 
                    {
                        idade: ano_nascimento ? ano_nascimento.toString() : "anonimizado", 
                        value: 0
                    }
                }

                if( de_resultado.indexOf("indetectavel") >= 0 || 
                    de_resultado.indexOf("nao detectado") >= 0 || 
                    de_resultado.indexOf("ausencia de anticorpos contra sars-cov-2") >= 0 
                )
                {
                    // do nothing
                }
                else 
                {
                    map[ano_nascimento].value += qtd;
                }
            }
        );
        
        let result = [];

        for( let prop in map )
        {   

            map[prop].idade = `${map[prop].idade}0-${map[prop].idade}9`;

            result.push(map[prop]);
        }

        cacheManager.setValue(key, result);
        
        return result;
    }
}

export default QueryManager;