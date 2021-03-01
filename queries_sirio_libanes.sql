
- junção de várias relações

    /* quantidade de internações por paciente por cidade*/
    select 
        Paciente.id_paciente, 
        Paciente.municipio,
        table1.qtd
    from Paciente 
    inner join (
        select id_paciente, count(*) as qtd from Atendimento group by id_paciente
    )  as table1
    on Paciente.id_paciente = table1.id_paciente;

- junções externas; 

- operações sobre conjuntos (união, diferença ou intersecção);

/*- funções de agregação;*/ 

    /* desfechos por cidade */
    select 
        Paciente.municipio as municipio,
        Atendimento.id_atendimento as id_atendimento,
        Atendimento.desfecho as desfecho,
        Atendimento.dt_desfecho as dt_desfecho
    from Paciente
    inner join Atendimento
    on Paciente.id_paciente = Atendimento.id_atendimento
    group by Paciente;


    select 
        Clinica.de_clinica
    from Clinica inner join 
    ( select id_clinica, desfecho, count( * ) as qtd from Atendimento group by id_clinica, desfecho ) as table1
    on Clinica.id_clinica = table1.id_clinica


    /* Pacientes sem atendimento */
    select Paciente.id_paciente from Paciente 
    left join Atendimento 
    on Paciente.id_paciente = Atendimento.id_paciente
    where Atendimento.id_atendimento is null; 


    select 
    de_resultado, 
    dt_coleta, 
    count( * )
    from Exame
    where de_resultado like "%detect%"
    and dt_coleta like "%/05/%"
    group by de_resultado, dt_coleta;
    



    /* Paciente detectados por cidade por data */


- subconsultas aninhadas.   



/* Atendimentos */

select id_paciente, count(*) as qtd 
from Atendimento 
group by id_paciente
order by qtd;

select * 
from Atendimento
where id_paciente like "5e46317d5210a201322d0bfe7558a0ea"
order by dt_atendimento;





