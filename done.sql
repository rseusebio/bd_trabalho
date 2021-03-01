
/* Primeira Linha */
        /* A) número de pacientes por cidade */
        select municipio, count(*) as qtd 
        from Paciente group by municipio;

        CREATE index municipio_index on Paciente (municipio);
        ALTER TABLE Paciente ADD INDEX paciente_index (id_paciente);

        /* B) número de atendimentos por cidade */
        select municipio, count(*) as qtd
        from Paciente
        inner join Atendimento
        on Paciente.id_paciente = Atendimento.id_paciente
        group by municipio;

        ALTER TABLE Atendimento ADD INDEX paciente_index (id_paciente);
        ALTER TABLE Atendimento ADD INDEX atendimento_index (id_atendimento);
        


        /* C) Media atendimento por cidade */ 
        select 
        t1.municipio,
        atendimentos / pacientes as qtd
        from
        ( select municipio, count(*) as atendimentos
            from Paciente
            inner join Atendimento
            on Paciente.id_paciente = Atendimento.id_paciente
            group by municipio
            order by atendimentos
        ) as t1 
        inner join 
        (select municipio, count(*) as pacientes 
            from Paciente group by municipio
        ) as t2 
        on t2.municipio = t1.municipio
        order by municipio;

/*Segunda linha*/

    /* razão obitos por atendimento por cidade ( em relação ao total ) */
    /* bar chart */
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
            -- and Atendimento.desfecho not like "%alta%"
        group by 
            Paciente.municipio,  
            Atendimento.desfecho
        order by 
            Paciente.municipio;
            

    --numero de casos de covid por cidade

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
    
        ALTER TABLE Exame ADD INDEX exame_index (de_exame);
    
    -- Numero de diagostico de covid por mes ( por cidade )
    -- line chart

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

    /* Terceira Linha */

    -- Numero de obitos por mes entre as pessoas diagnosticadas com covid-19 ( por cidade )
    -- LineChart

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


    -- Contaminados por idade ( por cidade )
        select 
            t1.municipio,
            t1.ano_nascimento,
            -- t2.de_resultado,
            count(*) as qtd
        from
            (
                select 
                    Paciente.id_paciente,
                    Paciente.ano_nascimento,
                    Paciente.municipio, 
                    Atendimento.id_atendimento
                from 
                    Paciente
                inner join
                    Atendimento
                on 
                    Paciente.id_paciente = Atendimento.id_paciente
                -- where Paciente.municipio like "%%"
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



         
